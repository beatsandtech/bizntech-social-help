<#
.SYNOPSIS
  Instant Web CMS - 1-Click Hostinger & GitHub Deployment Tool
.DESCRIPTION
  Automates local commits, GitHub repo creation, and Hostinger auto-deploy synchronization.
#>

param(
    [string]$CommitMessage = "Update website content and layout",
    [string]$RepoName = ""
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Instant Web CMS - GitHub & Hostinger Sync" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Check Git Initialization
if (-not (Test-Path ".git")) {
    Write-Host "[*] Initializing local Git repository..." -ForegroundColor Gray
    git init
    git branch -M main
    git add .
    git commit -m "Initial commit"
    Write-Host "[✓] Git initialized." -ForegroundColor Green
}

# 2. Check for Remote / Create on GitHub automatically
$remotes = git remote
if (-not $remotes) {
    if (-not $RepoName) {
        $folderName = (Get-Item -Path ".").Name
        $RepoName = $folderName.ToLower() -replace '[^a-z0-9-_]', '-'
    }
    
    Write-Host "[*] No remote detected. Checking GitHub CLI..." -ForegroundColor Cyan
    $ghInstalled = Get-Command gh -ErrorAction SilentlyContinue

    if ($ghInstalled) {
        Write-Host "[*] Automatically creating private repository '$RepoName' on GitHub..." -ForegroundColor Cyan
        gh repo create $RepoName --private --source=. --remote=origin --push
        if ($LASTEXITCODE -eq 0) {
            Write-Host "[✓] Repository successfully created and linked to GitHub!" -ForegroundColor Green
        } else {
            Write-Host "[!] Note: Ensure you are logged into GitHub CLI (run: gh auth login)" -ForegroundColor Yellow
        }
    } else {
        $repoUrl = Read-Host "Enter your GitHub repository URL (e.g. https://github.com/user/repo.git)"
        if ($repoUrl) {
            git remote add origin $repoUrl
            git push -u origin main
        }
    }
}

# 3. Commit Local Changes
$status = git status --porcelain
if ($status) {
    Write-Host "[*] Staging changed files..." -ForegroundColor Gray
    git add .
    Write-Host "[*] Committing changes: '$CommitMessage'" -ForegroundColor Gray
    git commit -m "$CommitMessage"
} else {
    Write-Host "[i] No new local changes to commit." -ForegroundColor Gray
}

# 4. Push to GitHub (Triggers Hostinger Auto-Deploy)
Write-Host "[*] Pushing latest updates to GitHub..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "=========================================" -ForegroundColor Green
    Write-Host "  [✓] Website successfully synchronized!" -ForegroundColor Green
    Write-Host "  Hostinger auto-deployment is updated." -ForegroundColor Green
    Write-Host "=========================================" -ForegroundColor Green
} else {
    Write-Host "[X] Push failed. Check credentials or run: git push origin main" -ForegroundColor Red
}
