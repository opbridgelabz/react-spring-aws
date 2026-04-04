pipeline {
    agent any
    tools {
        maven 'maven'
    }
    environment {
        DOCKERHUB_USER = 'koti777'
        BACKEND_IMAGE = "${DOCKERHUB_USER}/spring-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/library-frotend"
        VM_USER = 'ec2-user'
        VM_HOST = '13.51.194.102'
        DEPLOY_PATH = '/home/ec2-user/react-spring-project'
    }
    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Images') {
            steps {
                script {
                    sh """
                    # ✅ --no-cache ensures fresh build with latest code every time
                    docker build --no-cache -t ${BACKEND_IMAGE}:${GIT_COMMIT} ./spring-backend
                    docker build --no-cache -t ${FRONTEND_IMAGE}:${GIT_COMMIT} ./library-frontend
                    docker tag ${BACKEND_IMAGE}:${GIT_COMMIT} ${BACKEND_IMAGE}:latest
                    docker tag ${FRONTEND_IMAGE}:${GIT_COMMIT} ${FRONTEND_IMAGE}:latest
                    """
                }
            }
        }
        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS')
                ]) {
                    sh """
                    echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin
                    docker push ${BACKEND_IMAGE}:${GIT_COMMIT}
                    docker push ${BACKEND_IMAGE}:latest
                    docker push ${FRONTEND_IMAGE}:${GIT_COMMIT}
                    docker push ${FRONTEND_IMAGE}:latest
                    docker logout
                    """
                }
            }
        }
        stage('Deploy to EC2') {
            steps {
                withCredentials([
                    sshUserPrivateKey(credentialsId: 'ec2-ssh-t',
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER')
                ]) {
                    sh """
                    # Setup clean key file
                    mkdir -p ~/.ssh
                    cp \$SSH_KEY ~/.ssh/deploy_key
                    chmod 600 ~/.ssh/deploy_key

                    # Create remote directory
                    ssh -o StrictHostKeyChecking=no \
                        -i ~/.ssh/deploy_key \
                        ${VM_USER}@${VM_HOST} 'mkdir -p ${DEPLOY_PATH}'

                    # Copy docker-compose.yml
                    rsync -av -e "ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no" \
                        docker-compose.yml ${VM_USER}@${VM_HOST}:${DEPLOY_PATH}/

                    # Copy nginx/ only if it exists locally
                    if [ -d "nginx" ]; then
                        echo "✅ nginx/ found, syncing..."
                        rsync -av -e "ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no" \
                            nginx/ ${VM_USER}@${VM_HOST}:${DEPLOY_PATH}/nginx/
                    else
                        echo "⚠️ nginx/ not found in workspace, skipping..."
                    fi

                    # Deploy on EC2
                    ssh -o StrictHostKeyChecking=no \
                        -i ~/.ssh/deploy_key \
                        ${VM_USER}@${VM_HOST} bash << 'ENDSSH'

                    # ✅ Auto-install Docker Compose V2 if missing
                    if ! docker compose version > /dev/null 2>&1; then
                        echo "⚙️ Docker Compose not found, installing..."
                        mkdir -p ~/.docker/cli-plugins
                        curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
                            -o ~/.docker/cli-plugins/docker-compose
                        chmod +x ~/.docker/cli-plugins/docker-compose
                        echo "✅ Docker Compose installed: $(docker compose version)"
                    else
                        echo "✅ Docker Compose already installed: $(docker compose version)"
                    fi

                    # Force pull latest images
                    cd ${DEPLOY_PATH}
                    docker compose pull --no-parallel

                    # Stop old containers
                    docker compose down --remove-orphans

                    # ✅ Force recreate so new image is always used
                    docker compose up -d --force-recreate --remove-orphans

                    # Clean old images
                    docker image prune -f

ENDSSH

                    # Cleanup key
                    rm -f ~/.ssh/deploy_key
                    """
                }
            }
        }
    }
    post {
        success {
            echo "✅ Deployment completed successfully"
        }
        failure {
            sh 'rm -f ~/.ssh/deploy_key || true'
            echo "❌ Deployment failed - check Jenkins logs"
        }
    }
}
