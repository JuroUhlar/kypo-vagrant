#!/bin/sh

# This is the main script for provisioning.  Out of this
# file, everything that builds the box is executed.

### Software ###
# NodeJS 4.4.5
# MongoDB 3.2.7
# MySQL
# Git


### Build the box


# Make /opt directory owned by vagrant user
sudo chown vagrant:vagrant /opt/

### Update the system
sudo apt-get update


echo mysql-server mysql-server/root_password password password | sudo debconf-set-selections
echo mysql-server mysql-server/root_password_again password password | sudo debconf-set-selections


### Install system dependencies
sudo apt-get install -y build-essential curl gcc g++ git libaio1 libaio-dev nfs-common openssl npm


### NodeJS ###


### Node 4.4.5
# Download the binary
wget http://nodejs.org/dist/v4.4.5/node-v4.4.5-linux-x64.tar.gz -O /tmp/node-v4.4.5-linux-x64.tar.gz

# Unpack it
cd /tmp
tar -zxvf /tmp/node-v4.4.5-linux-x64.tar.gz
mv /tmp/node-v4.4.5-linux-x64 /opt/node-v4.4.5-linux-x64
ln -s /opt/node-v4.4.5-linux-x64 /opt/nodejs

# Set the node_path
export NODE_PATH=/opt/nodejs/lib/node_modules
export NODE_PATH=$NODE_PATH:/opt/dev/node_modules
export NODE_PATH=$NODE_PATH:/opt/dev/lib/node_modules
export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules

# Install global Node dependencies
/opt/nodejs/bin/npm install -g n
/opt/nodejs/bin/npm config set loglevel http





### Add binaries to path ###


# First run the command
export PATH=$PATH:/opt/mongodb/bin:/opt/mysql/server-5.6/bin:/opt/nodejs/bin
export NODE_PATH=/opt/nodejs/lib/node_modules
export NODE_PATH=$NODE_PATH:/opt/dev/node_modules
export NODE_PATH=$NODE_PATH:/opt/dev/lib/node_modules
export NODE_PATH=$NODE_PATH:/usr/local/lib/node_modules/lib/node_modules:/usr/local/lib/node_modules

# Now save to the /etc/bash.bashrc file so it works on reboot
cp /etc/bash.bashrc /tmp/bash.bashrc
printf "\n#Add binaries to path\n\nexport PATH=$PATH:/opt/mongodb/bin:/opt/mysql/server-5.6/bin:/opt/nodejs/bin\nexport NODE_PATH=/opt/nodejs/lib/node_modules\nexport NODE_PATH=$NODE_PATH:/opt/dev/node_modules\nexport NODE_PATH=$NODE_PATH:/opt/dev/lib/node_modules" > /tmp/path
cat /tmp/path >> /tmp/bash.bashrc
sudo chown root:root /tmp/bash.bashrc
sudo mv /tmp/bash.bashrc /etc/bash.bashrc


### Update the /etc/hosts file ###
printf '127.0.0.1       localhost\n127.0.1.1       debian-squeeze.caris.de debian-squeeze nodebox\n\n# The following lines are desirable for IPv6 capable hosts\n::1     ip6-localhost ip6-loopback\nfe00::0 ip6-localnet\nff00::0 ip6-mcastprefix\nff02::1 ip6-allnodes\nff02::2 ip6-allrouters' > /tmp/hosts
sudo mv /tmp/hosts /etc/hosts


### Install Git Aware Prompt ###
mkdir ~/.bash
cd ~/.bash
git clone git://github.com/jimeh/git-aware-prompt.git

printf 'export GITAWAREPROMPT=~/.bash/git-aware-prompt\nsource $GITAWAREPROMPT/main.sh\n\nexport PS1="\${debian_chroot:+(\\$debian_chroot)}\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\] \\[$txtcyn\\]\\$git_branch\\[$txtred\\]\\$git_dirty\\[$txtrst\\]\$ "' > ~/.bash_profile



### Set a message of the day ###
sudo rm /etc/motd
sudo cp /vagrant/files/motd.txt /etc/motd


### Test that everything is installed ok ###
printf "\n\n--- Running post-install checks ---\n\n"
node /vagrant/files/postInstall.js





### Finished ###
printf "\n\n--- NodeBox is now built ---\n\n"


### MY STUFF
sudo npm install -g npm@latest --no-bin-links
sudo npm install -g node-pre-gyp --no-bin-links
# npm install -g @angular/cli --no-bin-links
sudo npm install http-server -g

printf "\n\n--- App prerequisites are now installed ---\n\n"


npm install /opt/dev/backend/
npm start /opt/dev/backend/ > backendlog.txt & http-server /opt/dev/frontend/dist/ -p 4200 > frontendlog.txt & printf "\n\n--- Everything should be running now.  --- \n Server: http://localhost:5000 \n App: http://localhost:4201  \n\n"