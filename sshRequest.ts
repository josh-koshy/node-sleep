const { NodeSSH } = require("node-ssh")
const ssh = new NodeSSH()

export function shutdownJosh() {
    ssh.connect({
        host: '100.00.00.00', // random CGNAT hostname, replace with your own
        username: 'josh',
        privateKeyPath: '/home/ubuntu/keyfolder'
      }).then(function() { ssh.execCommand('echo <sudo password> | sudo -S shutdown -h now') }).then(function(result) {
      })
  }

  export function sleepJosh() {
    ssh.connect({
        host: '100.00.00.00', // random CGNAT hostname, replace with your own
        username: 'josh',
        privateKeyPath: '/home/ubuntu/keyfolder'
      }).then(function() { ssh.execCommand('pmset displaysleepnow') }).then(function(result) {
      })

}
