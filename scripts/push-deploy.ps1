# From Windows: push + redeploy InvestPro in one command.
# Usage: .\scripts\push-deploy.ps1
$ErrorActionPreference = "Stop"

$RemoteHost = if ($env:DEPLOY_HOST) { $env:DEPLOY_HOST } else { "root@178.104.115.86" }
$RemoteApp = if ($env:REMOTE_APP) { $env:REMOTE_APP } else { "/var/www/InvestPro" }
$SshKey = if ($env:DEPLOY_SSH_KEY) { $env:DEPLOY_SSH_KEY } else { "$env:USERPROFILE\.ssh\id_ed25519_investpro" }

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
Write-Host "==> pushing $branch"
git push -u origin $branch

$sshArgs = @("-o", "StrictHostKeyChecking=accept-new")
if (Test-Path $SshKey) {
  $sshArgs += @("-i", $SshKey)
}
$sshArgs += @($RemoteHost, "bash $RemoteApp/scripts/redeploy.sh")

Write-Host "==> remote redeploy"
& ssh @sshArgs
Write-Host "==> done"
