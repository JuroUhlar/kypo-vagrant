# Vagrant Nodebox for KYPO visualization tool

A virtual envirnment for running KYPO games visualizations

### Software
 - NodeJS & npm
 - Http-server
 - Git
 - [Git Aware Prompt](https://github.com/jimeh/git-aware-prompt)

**NB.** This is a 64 bit install.  If you have a 32 bit system, this will not work.

# Networking

The Vagrant box is assigned the IP 10.20.30.60.  You can access all the services from this IP address.  It is a good idea to put this into [your hosts file](http://www.howtogeek.com/howto/27350/beginner-geek-how-to-edit-your-hosts-file/) for a dev URL of your project.


# How to install

 1. Download and install Vagrant from [VagrantUp.com](http://www.vagrantup.com/downloads.html)
 2. Download and install VirtualBox from [Virtualbox.org](https://www.virtualbox.org/)
 3. In the root of the project, type `vagrant up` (this will take a loooong time)
 4. That's it. The app is now running. 
 ** server runs on localhost:5000 (on your host machine)
 ** clinet runs on localhost: 4201 (on your host machine)

(your 5000 port is forwarded to 5000 port on the virtual machine,
 your 4201 port is forwarded to 4200 port on the virtual machine)

## Pausing the VM s

* to pause the VM in its current state, use `vagrant suspend`
* to run it again , use `vagrant up`
** it should wake up much faster and still be running the client app
** the server doesn't wake after suspension for some reason, so you have to restart it manually:
*** ssh into VM: `vagrant ssh`
*** start server: `/vagrant/runserver.sh`

## Stopping the VM 

* to halt the VM (as if shutting down the computer), use `vagrant halt`
* to start it again use `vagrant up`
* now you have to start both the server and the client manually with a script: `/vagrant/runall.sh`

## Removing the VM

* to completely remove the virtual machine type in `vagrant destroy` in the root directory 
* to rebuild again, use `vagrant up` again (it will take very long again)


# Shared folders

The `KypoViz-client` and `KypoViz-server` folders are shared between the host and the virtual machine. Their content can be found on `/opt/dev/` in the virtual machine. That way you can edit the source code in the host, but run the development envinment in vagrant. 

# SSHing

This is fairly simple.  In a terminal, go to your Vagrant directory and type `vagrant ssh`.  That will connect you to the Vagrant box and you can control it.  Your user is `vagrant` and you have passwordless _sudo_ access. 

If this doesn't work on Windows with the native Commnad prompt, use [Cmder](http://cmder.net/) instead.

