pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'react-app-image'
        NETLIFY_AUTH_TOKEN = credentials('nfp_LwS7bbdd2oR3KRDbjXiBkaZFdCordmcg639c')
        NETLIFY_SITE_ID = '023ed5da-c7ca-4f9e-b163-aa582332b436'
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
                sh 'npm run test'  // Adjust the path to your tests as necessary
            }
        }

        // Add the missing build step
        stage('Build React App') {
            steps {
                echo 'Building React App for production...'
                sh 'npm run build' // This will generate the ./build directory
            }
        }

        stage('Deploy to Netlify') {
            steps {
                echo 'Deploying to Netlify...'
                sh '''
                netlify deploy --prod \
                --auth $NETLIFY_AUTH_TOKEN \
                --site $NETLIFY_SITE_ID \
                --dir ./build
                '''
            }
        }
    }

    post {
        success {
            echo 'Build, tests, and deployment ran successfully!'
        }
        failure {
            echo 'Build, tests, or deployment failed!'
            script {
                // Optional: capture logs from the Docker container on failure
                sh 'docker logs react-app-container || true'
            }
        }
    }
}