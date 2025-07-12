# === AIModelOps CLI Control Script ===

function Show-MainMenu {
    while ($true) {
        Write-Host ""
        Write-Host "=== Main Menu ==="
        Write-Host "1. Run AI Model Ops"
        Write-Host "2. Build/Deploy (Azure)"
        Write-Host "3. Check Database"
        Write-Host ""
        Write-Host "0. Exit"
        $mainChoice = Read-Host "Select an option"
        switch ($mainChoice) {
            "1" { Show-AIModelOpsMenu }
            "2" { Show-BuildDeployMenu }
            "3" { Show-DatabaseMenu }
            "0" { break }
            default { Write-Host "Invalid choice" }
        }
    }
}

function Show-AIModelOpsMenu {
    while ($true) {
        Write-Host ""
        Write-Host "=== Run AI Model Ops ==="
        Write-Host "1. Run single prompt"
        Write-Host "2. Run batch prompt"
        Write-Host "3. Run prompt chain"
        Write-Host ""
        Write-Host "0. Back"
        $aiChoice = Read-Host "Select an option"
        switch ($aiChoice) {
            "1" { 
                # Example: call your runner/run_prompt.py with args (edit as needed)
                python runner/run_prompt.py
            }
            "2" { 
                # Example: run batch (edit as needed)
                python runner/run_batch.py
            }
            "3" { 
                # Example: run chain (edit as needed)
                python runner/run_prompt_chain.py
            }
            "0" { break }
            default { Write-Host "Invalid choice" }
        }
    }
}

function Show-BuildDeployMenu {
    $ACR_NAME = "aimocr.azurecr.io"
    $RESOURCE_GROUP = "AIMOResourceGroup"
    $FRONTEND_NAME = "frontend"
    $RUNNER_NAME = "runner"
    $IMAGE = "$ACR_NAME/runner:latest"
    while ($true) {
        Write-Host ""
        Write-Host "=== Build/Deploy (Azure) ==="
        Write-Host "1. Build Docker image"
        Write-Host "2. Push image to ACR"
        Write-Host "3. Deploy frontend container"
        Write-Host "4. Deploy runner container"
        Write-Host "5. Build + Push + Deploy both"
        Write-Host ""
        Write-Host "0. Back"
        $deployChoice = Read-Host "Select an option"
        switch ($deployChoice) {
            "1" { docker build -t $IMAGE . }
            "2" { 
                az acr login --name aimocr
                docker push $IMAGE
            }
            "3" { 
                az container delete --resource-group $RESOURCE_GROUP --name $FRONTEND_NAME --yes
                az container create --resource-group $RESOURCE_GROUP --name $FRONTEND_NAME --image $IMAGE --registry-login-server $ACR_NAME
            }
            "4" { 
                az container delete --resource-group $RESOURCE_GROUP --name $RUNNER_NAME --yes
                az container create --resource-group $RESOURCE_GROUP --name $RUNNER_NAME --image $IMAGE --registry-login-server $ACR_NAME
            }
            "5" { 
                docker build -t $IMAGE .
                az acr login --name aimocr
                docker push $IMAGE
                az container delete --resource-group $RESOURCE_GROUP --name $FRONTEND_NAME --yes
                az container create --resource-group $RESOURCE_GROUP --name $FRONTEND_NAME --image $IMAGE --registry-login-server $ACR_NAME
                az container delete --resource-group $RESOURCE_GROUP --name $RUNNER_NAME --yes
                az container create --resource-group $RESOURCE_GROUP --name $RUNNER_NAME --image $IMAGE --registry-login-server $ACR_NAME
            }
            "0" { break }
            default { Write-Host "Invalid choice" }
        }
    }
}

function Show-DatabaseMenu {
    while ($true) {
        Write-Host ""
        Write-Host "=== Check Database ==="
        Write-Host "1. Show last N logs"
        Write-Host "2. Check DB connection"
        Write-Host ""
        Write-Host "0. Back"
        $dbChoice = Read-Host "Select an option"
        switch ($dbChoice) {
            "1" { Write-Host "Not implemented yet" }
            "2" { Write-Host "Not implemented yet" }
            "0" { break }
            default { Write-Host "Invalid choice" }
        }
    }
}

Show-MainMenu
