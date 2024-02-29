deploy-staging:
	yarn build
	rsync -avhzL --delete \
             --exclude node_modules \
             --exclude .husky \
             --exclude .idea \
             --exclude .git \
             --exclude .vscode \
             --exclude .env \
          . ubuntu@13.230.118.245:sleefi-backend


deploy-test:
	# yarn build
	rsync -avhzL --delete \
	        --exclude node_modules \
            --exclude .husky \
            --exclude .idea \
            --exclude .vscode \
            --exclude .git \
            --exclude .env \
        . ubuntu@54.64.37.161:sleefi-backend-test



deploy-dev:
	yarn build
	rsync -avhzL --delete \
	        --exclude node_modules \
            --exclude .husky \
            --exclude .idea \
            --exclude .vscode \
            --exclude .git \
            --exclude .env \
        . ubuntu@54.64.37.161:sleefi-backend

deploy-alpha:
	  yarn build
	  rsync -avhzL --delete \
                 --exclude node_modules \
                 --exclude .husky \
                 --exclude .idea \
                 --exclude .git \
                 --exclude .vscode \
                 --exclude .env \
              . ubuntu@35.74.191.128:sleefi-backend-test

deploy-minting:
	  yarn build
	  rsync -avhzL --delete \
                 --exclude node_modules \
                 --exclude .husky \
                 --exclude .idea \
                 --exclude .git \
                 --exclude .vscode \
                 --exclude .env \
              . ubuntu@13.230.118.245:sleefi-minting


start-server:
	pm2 start ecosystem.config.js
