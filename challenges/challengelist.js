/** Information required for challenge creation and summary display. */
class ChallengeList {
  /** Initialise variables required for challenge creation and summaries. */
  constructor() {
    this.DUR_AFTER = 300;
    this.challengeList = {};
  }
  /**
   * Generate a summary of posted totals for a challenge.
   * @param {Number} channel - Discord ID of the channel being posted to.
   * @param {Number} challengeID - Unique ID of the challenge being summarised.
   */
  generateSummary(channel, challengeID) {
    let msgToSend = '';
    if (challengeID in this.challengeList) {
      if (this.challengeList[challengeID].type != 'sprint') {
        if (this.challengeList[challengeID].state >= 2) {
          const summaryServer = channel.guild;
          let userTotal = '';
          const totalWords = {};
          const totalLines = {};
          const totalPages = {};
          const totalMinutes = {};
          for (const user in this.challengeList[challengeID].joinedUsers) {
            if (
              Number.isInteger(
                  Number(
                      this.challengeList[challengeID]
                          .joinedUsers[user].countData
                  )
              ) &&
              this.challengeList[challengeID].joinedUsers[user].countType !=
                undefined
            ) {
              const homeServer = client.channels.get(
                  this.challengeList[challengeID].joinedUsers[user].channelID
              ).guild.id;
              if (homeServer == summaryServer.id) {
                userTotal +=
                  client.users.get(user) +
                  ': **' +
                  this.challengeList[challengeID].joinedUsers[user].countData +
                  '** ';
                if (
                  this.challengeList[challengeID].joinedUsers[user]
                      .countData == 1
                ) {
                  userTotal +=
                    this.challengeList[challengeID].joinedUsers[
                        user
                    ].countType.slice(0, -1);
                } else {
                  userTotal +=
                    this.challengeList[challengeID].joinedUsers[user]
                        .countType
                }
                if (this.challengeList[challengeID].joinedUsers[user]
                    .countType != 'minutes') {
                  userTotal +=
                  ' (**' +
                  (this.challengeList[challengeID]
                      .joinedUsers[user].countData /
                  this.challengeList[challengeID].duration).toFixed(2) +
                  '** ' +
                  this.challengeList[challengeID].joinedUsers[
                      user
                  ].countType.slice(0, 1) +
                  'pm)\n';
                } else {
                  userTotal += '\n';
                }
              }
              if (!(homeServer in totalWords)) {
                totalWords[homeServer] = 0;
              }
              if (!(homeServer in totalLines)) {
                totalLines[homeServer] = 0;
              }
              if (!(homeServer in totalPages)) {
                totalPages[homeServer] = 0;
              }
              if (!(homeServer in totalMinutes)) {
                totalMinutes[homeServer] = 0;
              }
              switch (
                this.challengeList[challengeID].joinedUsers[user].countType
              ) {
                case 'words':
                  totalWords[homeServer] += parseInt(
                      this.challengeList[challengeID].joinedUsers[user]
                          .countData
                  );
                  break;
                case 'lines':
                  totalLines[homeServer] += parseInt(
                      this.challengeList[challengeID].joinedUsers[user]
                          .countData
                  );
                  break;
                case 'pages':
                  totalPages[homeServer] += parseInt(
                      this.challengeList[challengeID].joinedUsers[user]
                          .countData
                  );
                  break;
                case 'minutes':
                  totalMinutes[homeServer] += parseInt(
                      this.challengeList[challengeID].joinedUsers[user]
                          .countData
                  );
                  break;
                default:
                  break;
              }
            }
          }
          let firstType = true;
          let summaryData =
            '***Statistics for ' +
            this.challengeList[challengeID].displayName +
            ':***\n\n' +
            userTotal +
            summaryServer.name +
            ' Total:';
          if (totalWords[summaryServer.id] > 0) {
            summaryData += ' **' + totalWords[summaryServer.id];
            if (totalWords[summaryServer.id] == 1) {
              summaryData += '** word';
            } else {
              summaryData += '** words';
            }
            firstType = false;
          }
          if (totalLines[summaryServer.id] > 0) {
            if (!firstType) {
              summaryData += ',';
            }
            summaryData += ' **' + totalLines[summaryServer.id];
            if (totalLines[summaryServer.id] == 1) {
              summaryData += '** line';
            } else {
              summaryData += '** lines';
            }
            firstType = false;
          }
          if (totalPages[summaryServer.id] > 0) {
            if (!firstType) {
              summaryData += ',';
            }
            summaryData += ' **' + totalPages[summaryServer.id];
            if (totalPages[summaryServer.id] == 1) {
              summaryData += '** page';
            } else {
              summaryData += '** pages';
            }
            firstType = false;
          }
          if (totalMinutes[summaryServer.id] > 0) {
            if (!firstType) {
              summaryData += ',';
            }
            summaryData += ' **' + totalMinutes[summaryServer.id];
            if (totalMinutes[summaryServer.id] == 1) {
              summaryData += '** minute';
            } else {
              summaryData += '** minutes';
            }
            firstType = false;
          }
          // this server's summary
          if (!firstType) {
            msgToSend += summaryData;
          }
          // other servers' summaries
          let crossServerSummary = '\n';
          let crossData = false;
          for (
            let i = 0;
            i < this.challengeList[challengeID].hookedChannels.length;
            i++
          ) {
            const currentChannel = this.challengeList[challengeID]
                .hookedChannels[
                    i
                ];
            const currentServer = client.channels.get(currentChannel).guild;
            if (currentServer.id != channel.guild.id) {
              let serverSummary = '__*' + currentServer.name + '*__:';
              let xfirstType = true;
              if (totalWords[currentServer.id] > 0) {
                serverSummary += ' **' + totalWords[currentServer.id];
                if (totalWords[currentServer.id] == 1) {
                  serverSummary += '** word';
                } else {
                  serverSummary += '** words';
                }
                xfirstType = false;
              }
              if (totalLines[currentServer.id] > 0) {
                if (!xfirstType) {
                  serverSummary += ',';
                }
                serverSummary += ' **' + totalLines[currentServer.id];
                if (totalLines[currentServer.id] == 1) {
                  serverSummary += '** line';
                } else {
                  serverSummary += '** lines';
                }
                xfirstType = false;
              }
              if (totalPages[currentServer.id] > 0) {
                if (!xfirstType) {
                  serverSummary += ',';
                }
                serverSummary += ' **' + totalPages[currentServer.id];
                if (totalPages[currentServer.id] == 1) {
                  serverSummary += '** page';
                } else {
                  serverSummary += '** pages';
                }
                xfirstType = false;
              }
              if (totalMinutes[currentServer.id] > 0) {
                if (!xfirstType) {
                  serverSummary += ',';
                }
                serverSummary += ' **' + totalMinutes[currentServer.id];
                if (totalMinutes[currentServer.id] == 1) {
                  serverSummary += '** minute';
                } else {
                  serverSummary += '** minutes';
                }
                xfirstType = false;
              }
              if (!xfirstType) {
                crossData = true;
                crossServerSummary += serverSummary + '\n';
              }
            }
          }
          if (crossData) {
            if (firstType) {
              msgToSend +=
                '***Statistics for ' +
                this.challengeList[challengeID].displayName +
                ':***\n';
            }
            msgToSend += crossServerSummary;
          }
          if (msgToSend == '') {
            msgToSend =
              '***Statistics for ' +
              this.challengeList[challengeID].displayName +
              ':***\nNobody has posted a total for this war yet.';
          }
        } else {
          msgToSend = 'Error: This war has not ended yet.';
        }
      } else {
        if (this.challengeList[challengeID].state == 1) {
          const summaryServer = channel.guild;
          let userTotal = '';
          const totalUsers = {};
          const totalMinutes = {};
          for (const user in this.challengeList[challengeID].joinedUsers) {
            if (
              this.challengeList[challengeID].joinedUsers[user].timeTaken !=
                undefined
            ) {
              const homeServer = client.channels.get(
                  this.challengeList[challengeID].joinedUsers[user].channelID
              ).guild.id;
              if (homeServer == summaryServer.id) {
                const wordsPerMinute = (this.challengeList[challengeID].goal /
                  this.challengeList[challengeID].joinedUsers[user].timeTaken);
                userTotal +=
                  client.users.get(user) +
                  ': **' +
                  this.challengeList[challengeID].joinedUsers[user]
                      .timeTaken.toFixed(2) +
                  '** minutes (**' +
                  wordsPerMinute.toFixed(2) +
                  '** wpm)\n';
              }
              if (!(homeServer in totalUsers)) {
                totalUsers[homeServer] = 0;
              }
              if (!(homeServer in totalMinutes)) {
                totalMinutes[homeServer] = 0;
              }
              totalUsers[homeServer] += 1;
              totalMinutes[homeServer] +=
                  this.challengeList[challengeID].joinedUsers[user].timeTaken;
            }
          }
          let summaryData =
            '***Statistics for ' +
            this.challengeList[challengeID].displayName +
            ':***\n\n' +
            userTotal +
            summaryServer.name +
            ' Time Taken:';
          if (totalMinutes[summaryServer.id] > 0) {
            summaryData += ' **' + totalMinutes[summaryServer.id].toFixed(2);
            if (totalMinutes[summaryServer.id] == 1) {
              summaryData += '** minute (**';
            } else {
              summaryData += '** minutes (**';
            }
            summaryData += ((totalUsers[summaryServer.id] *
              this.challengeList[challengeID].goal) /
              totalMinutes[summaryServer.id]).toFixed(2) +
              '** wpm)';
          }
          // this server's summary
          if (totalUsers[summaryServer.id] > 0) {
            msgToSend += summaryData;
          }
          let crossServerSummary = '\n';
          let crossData = false;
          for (
            let i = 0;
            i < this.challengeList[challengeID].hookedChannels.length;
            i++
          ) {
            const currentChannel = this.challengeList[challengeID]
                .hookedChannels[
                    i
                ];
            const currentServer = client.channels.get(currentChannel).guild;
            if (currentServer.id != channel.guild.id) {
              let serverSummary = '__*' + currentServer.name + '*__:';
              if (totalMinutes[currentServer.id] > 0) {
                serverSummary += ' **' + totalMinutes[currentServer.id]
                    .toFixed(2);
                if (totalMinutes[currentServer.id] == 1) {
                  serverSummary += '** minute (**';
                } else {
                  serverSummary += '** minutes (**';
                }
                serverSummary += ((totalUsers[currentServer.id] *
                  this.challengeList[challengeID].goal) /
                  totalMinutes[currentServer.id]).toFixed(2) +
                  '** wpm)';
                crossData = true;
                crossServerSummary += serverSummary + '\n';
              }
            }
          }
          // other servers' summaries
          if (crossData) {
            if (totalUsers[summaryServer.id] == 0) {
              msgToSend +=
                '***Statistics for ' +
                this.challengeList[challengeID].displayName +
                ':***\n';
            }
            msgToSend += crossServerSummary;
          }
          if (msgToSend == '') {
            msgToSend =
              '***Statistics for ' +
              this.challengeList[challengeID].displayName +
              ':***\nNobody has finished this sprint yet.';
          }
        } else {
          msgToSend = 'Error: This sprint has not started yet.';
        }
      }
    } else {
      msgToSend = 'Error: This challenge does not exist.';
    }
    channel.send(msgToSend);
  }
}

module.exports = new ChallengeList();
