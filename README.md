# Vagrant Nodebox for KYPO visualization tool

A virtual envirnment for running KYPO games visualizations

### Software
 - NodeJS & npm
 - Http-server
 - Git
 - [Git Aware Prompt](https://github.com/jimeh/git-aware-prompt)

**NB.** This is a 64 bit install.  If you have a 32 bit system, this will not work.

# How to install

 1. Download and install Vagrant from [VagrantUp.com](http://www.vagrantup.com/downloads.html)
 2. Download and install VirtualBox from [Virtualbox.org](https://www.virtualbox.org/)
 3. In the root of the project, type `vagrant up` (this will take a loooong time)
 4. Login to the machine by typing `vagrant ssh` (run the consele as an administrator, just in case)
 5. Run the app by typing `runall`


 That's it. The app is now running. 
 
 * server runs on localhost:5000 (on your host machine) -> farwarded to port 5000 on the VM
 * client runs on localhost: 4201 (on your host machine) -> forwarded to 4200 on the VM

 You can kill both processes by typing `killall node` (this kills all node processes).

## Suspend, halt or destroy the VM

* to pause the VM in its current state, use `vagrant suspend` (in the Vagrant root folder, outside the VM)
* to halt the VM (as if shutting down the computer), use `vagrant halt`
* to completely remove the virtual machine type in `vagrant destroy` 
* to start it again use `vagrant up`

More details in  [Vagrant Documentation](https://www.vagrantup.com/intro/getting-started/teardown.html).

# Shared folders

The `KypoViz-client` and `KypoViz-server` folders are shared between the host and the virtual machine. Their content can be found on `/opt/dev/` in the virtual machine. That way you can edit the source code in the host, but run the development environment in vagrant. 

# SSHing

This is fairly simple.  In a terminal, go to your Vagrant directory and type `vagrant ssh`.  That will connect you to the Vagrant box and you can control it.  Your user is `vagrant` and you have passwordless _sudo_ access. 

If this doesn't work on Windows with the native Commnad prompt, use [Cmder](http://cmder.net/) instead.

