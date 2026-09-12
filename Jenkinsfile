pipeline {
    agent any

    options {
        timestamps()
        skipDefaultCheckout(false)
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Checking out branch: ${env.BRANCH_NAME ?: 'local'}"
                checkout scm
            }
        }

        stage('Install & Validate') {
            when {
                expression {
                    return env.CHANGE_ID != null || env.BRANCH_NAME == 'dev' || env.BRANCH_NAME == 'uat' || env.BRANCH_NAME == 'main'
                }
            }
            steps {
                echo 'Installing backend dependencies and running tests...'
                dir('backend') {
                    sh 'npm install'
                    sh 'npm test'
                }

                echo 'Installing frontend dependencies and building UI...'
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy DEV') {
            when {
                branch 'dev'
            }
            steps {
                echo 'Deploying DEV environment...'
                sh 'docker compose -f docker-compose.dev.yml up -d --build'
            }
        }

        stage('Deploy UAT') {
            when {
                branch 'uat'
            }
            steps {
                echo 'Deploying UAT environment...'
                sh 'docker compose -f docker-compose.uat.yml up -d --build'
            }
        }

        stage('Deploy PROD') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to Production Environment?', ok: 'Deploy'
                echo 'Deploying PROD environment...'
                sh 'docker compose -f docker-compose.prod.yml up -d --build'
            }
        }

        stage('PR Smoke Check') {
            when {
                expression {
                    return env.CHANGE_ID != null
                }
            }
            steps {
                echo 'Running PR smoke test against local app...'
                sh 'curl -f http://localhost:5000/api/health || exit 1'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully.'
        }
        failure {
            echo '❌ Pipeline failed. Please check build logs.'
        }
    }
}
