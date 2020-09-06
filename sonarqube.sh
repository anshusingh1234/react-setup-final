#!/bin/bash
#
# Args: deploy.sh
#

#cd ~

#wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-4.3.0.2102.zip

#unzip sonar-scanner-cli-4.3.0.2102.zip

#rm sonar-scanner-cli-4.3.0.2102.zip

chmod 777 /home/administrator/sonar-scanner-4.3.0.2102/conf/sonar-scanner.properties

echo 'sonar.host.url=http://172.16.0.220:9000' >> /home/administrator/sonar-scanner-4.3.0.2102/conf/sonar-scanner.properties

chmod +x /home/administrator/sonar-scanner-4.3.0.2102/bin/sonar-scanner

/home/administrator/sonar-scanner-4.3.0.2102/bin/sonar-scanner \
  -Dsonar.projectKey=build-social-media-platform-20023666-node-shivamsingh \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://172.16.0.220:9000 \
  -Dsonar.login=32cf9325138f97409198a1a1373cd27f6c9cdded