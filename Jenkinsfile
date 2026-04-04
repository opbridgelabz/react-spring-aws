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
                    docker build -t ${BACKEND_IMAGE}:${GIT_COMMIT} ./spring-backend
                    docker build -t ${FRONTEND_IMAGE}:${GIT_COMMIT} ./library-frontend
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
                    # ✅ Fix 1: Copy key to own location before chmod
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

                    # ✅ Fix 2: Only rsync nginx/ if it exists
                    if [ -d "nginx" ]; then
                        echo "✅ nginx/ found, syncing..."
                        rsync -av -e "ssh -i ~/.ssh/deploy_key -o StrictHostKeyChecking=no" \
                            nginx/ ${VM_USER}@${VM_HOST}:${DEPLOY_PATH}/nginx/
                    else
                        echo "⚠️ nginx/ not found in workspace, skipping..."
                    fi

                    # ✅ Fix 3: Use heredoc so ${DEPLOY_PATH} expands correctly
                    # ✅ Fix 4: Use docker-compose (V1) instead of docker compose (V2)
                    ssh -o StrictHostKeyChecking=no \
                        -i ~/.ssh/deploy_key \
                        ${VM_USER}@${VM_HOST} << 'ENDSSH'
                        cd ${DEPLOY_PATH} && \
                        docker-compose pull && \
                        docker-compose down && \
                        docker-compose up -d --remove-orphans
ENDSSH

                    # ✅ Fix 5: Cleanup key after use
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
            // ✅ Fix 6: Always cleanup key even on failure
            sh 'rm -f ~/.ssh/deploy_key || true'
            echo "❌ Deployment failed - check Jenkins logs"
        }
    }
}
