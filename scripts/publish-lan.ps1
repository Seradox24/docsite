param(
    [string]$IdentityFile = "$env:USERPROFILE\.ssh\codex_moodle"
)
$ErrorActionPreference = 'Stop'
$projectPath = Split-Path $PSScriptRoot -Parent
$releaseId = 'release-' + [Guid]::NewGuid().ToString('N')
$archivePath = Join-Path ([IO.Path]::GetTempPath()) ($releaseId + '.tar.gz')
$sshOptions = @('-i', $IdentityFile, '-o', 'IdentitiesOnly=yes', '-o', 'BatchMode=yes')
Push-Location $projectPath
try {
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Falló la compilación.' }
    $indexHash = (Get-FileHash -LiteralPath (Join-Path $projectPath 'dist/index.html') -Algorithm SHA256).Hash.ToLowerInvariant()
    & tar -czf $archivePath -C (Join-Path $projectPath 'dist') .
    if ($LASTEXITCODE -ne 0) { throw 'Falló el empaquetado.' }
    & scp @sshOptions $archivePath "moodle@192.168.50.11:/srv/plataforma/documentacion/$releaseId.tar.gz"
    if ($LASTEXITCODE -ne 0) { throw 'Falló la transferencia SSH.' }
    $remoteScript = @'
set -eu
umask 022
base=/srv/plataforma/documentacion
release=RELEASE_ID
expected_hash=EXPECTED_INDEX_SHA256
test -L "$base/public"
previous=$(readlink -f "$base/public")
case "$previous" in "$base"/releases/*) ;; *) echo 'Destino anterior fuera de releases'; exit 1;; esac
mkdir "$base/releases/$release"
tar -xzf "$base/$release.tar.gz" --no-same-owner --no-same-permissions -C "$base/releases/$release"
chmod -R u=rwX,go=rX "$base/releases/$release"
test -s "$base/releases/$release/index.html"
actual_hash=$(sha256sum "$base/releases/$release/index.html" | cut -d ' ' -f 1)
test "$actual_hash" = "$expected_hash"
grep -q 'id="contenido"' "$base/releases/$release/index.html"
ln -s "$base/releases/$release" "$base/public-$release"
mv -Tf "$base/public-$release" "$base/public"
rm -- "$base/$release.tar.gz"
response="$base/verify-$release.html"
if ! curl --fail --silent --show-error --resolve doc.minayao.site:443:127.0.0.1 -o "$response" https://doc.minayao.site/; then
    ln -s "$previous" "$base/rollback-$release"
    mv -Tf "$base/rollback-$release" "$base/public"
    echo 'Verificacion fallida; se restauro la version anterior.'
    exit 1
fi
served_hash=$(sha256sum "$response" | cut -d ' ' -f 1)
rm -- "$response"
if test "$served_hash" != "$expected_hash"; then
    ln -s "$previous" "$base/rollback-$release"
    mv -Tf "$base/rollback-$release" "$base/public"
    echo 'El HTML servido no coincide con dist; se restauro la version anterior.'
    exit 1
fi
echo "Publicado: $base/releases/$release"
echo "Version anterior conservada: $previous"
'@
    $remoteScript = $remoteScript.Replace('RELEASE_ID', $releaseId).Replace('EXPECTED_INDEX_SHA256', $indexHash).Replace("`r`n", "`n")
    $remoteScript | & ssh @sshOptions moodle@192.168.50.11 'bash -s'
    if ($LASTEXITCODE -ne 0) { throw 'Falló la publicación remota.' }
} finally {
    Pop-Location
    if (Test-Path -LiteralPath $archivePath) { Remove-Item -LiteralPath $archivePath }
}
