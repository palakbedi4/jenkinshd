pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'react-app-image'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker Image...'
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Run App in Docker') {
            steps {
                script {
                    echo 'Running app in Docker container...'
                    sh 'docker rm -f react-app-container || true'
                    sh 'docker run -d -p 3000:3000 --memory=1g --name react-app-container $DOCKER_IMAGE npm start'
                }
            }
        }

        stage('Run Selenium Tests') {
            steps {
                echo 'Running Selenium tests...'
                // Assuming you have Selenium tests configured
                // Adjust the path to your tests as necessary
                sh 'npm run test'
            }
        }
    }

    post {
        success {
            echo 'Build and tests ran successfully!'
        }
        failure {
            echo 'Build or tests failed!'
            script {
                // Optional: capture logs from the Docker container on failure
                sh 'docker logs react-app-container || true'
            }
        }
    }
}
