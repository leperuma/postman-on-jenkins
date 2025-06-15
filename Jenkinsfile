@Library("thor-shared-pipelines") _
def NODE_LABEL = 'generic';
def ENVIRONMENT = 'STAGE'
def WORKSPACE_DIR = '/var/jenkins/postman-on-jenkins'
def CURRENT_USER = null


pipeline {
  agent {
    node {
      label NODE_LABEL
      customWorkspace WORKSPACE_DIR
    }
  }

  options {
    ansiColor('xterm')
  }
  parameters {
    string(name: 'BRANCH', defaultValue: 'main', description: 'Enter the branch name which needs to be deployed into dev environment.')
    // string(name: 'JENKINS_TF_VERSION', defaultValue: '0.13.7', description: 'Enter the inteneded terraform version.')
    // string(name: 'KUBE_REGION', defaultValue: 'us-west-2', description: 'Enter the region to upgrade.')
  }

  stages {
    stage('Clone repository') {
      steps {
        sh "git checkout ${params.BRANCH}"
      }
    }

    stage('Use nodejs plugin') {
            steps {
                nodejs('nodejs 18.16') {
                    sh 'npm --version'
                    sh 'npm config set @opendns:registry https://engci-maven.cisco.com/artifactory/api/npm/umbrella-npm/ -g'
                    sh 'npm config ls'
                    sh 'npm install -g newman'
                }
            }
        }

    // stage('Install Newman') {
    //         steps {
    //             script {
    //                 // Install Newman globally
    //                 sh '''
    //                     mkdir "${HOME}/.npm-global"
    //                     npm config set prefix "${HOME}/.npm-global"
    //                     echo 'export PATH="$PATH:${HOME}/.npm-global/bin"' >> ~/.bashrc
    //                     source ~/.bashrc
    //                 '''
    //                 sh 'npm install -g newman'
    //             }
    //         }
    //     }

        stage('Run Postman Collection') {
            steps {
                script {
                    // Run your Postman collections using Newman
                    sh 'ls -ltrah'
                    sh 'newman run AutomationTest.postman_collection.json -r cli,junit --reporter-junit-export results-automation.xml'
                    sh 'newman run IntegrationTestingBasics.postman_collection.json -r cli,junit --reporter-junit-export results-integration.xml'
                }
            }
        }

        stage('Archive Test Results') {
            steps {
                // Archive the test result XMLs for reporting
                junit 'results-automation.xml'
                junit 'results-integration.xml'
            }
        }

}

  post {
		always {
			echo 'One way or another, Job is finished'
			deleteDir() /* clean up our workspace */
		}
		success {
			echo "success"
			// sparkSend credentialsId: 'identity-build-buddy', message: '**Success** - * Identity Stage EKS Cluster deployment from branch : ' + params.BRANCH + ' *: [${env.JOB_NAME} || ${env.BUILD_NUMBER}](${env.BUILD_URL})', messageType: 'markdown', spaceList: [
			// 	[spaceId: 'Y2lzY29zcGFyazovL3VybjpURUFNOnVzLWVhc3QtMl9hOmlkZW50aXR5TG9va3VwL1JPT00vM2FiMTc5MzAtNDQyYy0xMWU5LWJkNzEtZDk3NGU2MzdiZmVk', spaceName: 'Identity #Cluster#AD-ISS#GSuite#ADC#AzureAD']
			// ]
		}
		failure {
			echo "failure"
			// sparkSend credentialsId: 'identity-build-buddy', message: '**Failure** - * Identity Stage EKS Cluster deployment from branch : ' + params.BRANCH + ' *: [${env.JOB_NAME} || ${env.BUILD_NUMBER}](${env.BUILD_URL})', messageType: 'markdown', spaceList: [
			// 	[spaceId: 'Y2lzY29zcGFyazovL3VybjpURUFNOnVzLWVhc3QtMl9hOmlkZW50aXR5TG9va3VwL1JPT00vYTVjNDY0MDAtYzFjOS0xMWVhLTgxNDMtZjlhMDdjMGRkMWE0', spaceName: 'Identity #Cluster#AD-ISS#GSuite#ADC#AzureAD']
			// ]
		}
		aborted {
			echo "aborted"
					echo "failure"
			// sparkSend credentialsId: 'identity-build-buddy', message: '**Aborted** - * Identity Stage EKS Cluster deployment from branch : ' + params.BRANCH + ' *: [${env.JOB_NAME} || ${env.BUILD_NUMBER}](${env.BUILD_URL})', messageType: 'markdown', spaceList: [
			// 	[spaceId: 'Y2lzY29zcGFyazovL3VybjpURUFNOnVzLWVhc3QtMl9hOmlkZW50aXR5TG9va3VwL1JPT00vYTVjNDY0MDAtYzFjOS0xMWVhLTgxNDMtZjlhMDdjMGRkMWE0', spaceName: 'Identity #Cluster#AD-ISS#GSuite#ADC#AzureAD']
			// ]
		}
	}

}
