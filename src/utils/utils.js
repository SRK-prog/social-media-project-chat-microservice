class Utils {
  static isFunc = (f) => typeof f === "function";

  static getMapKey(map, value) {
    return [...map].find(([key, val]) => val == value);
  }

  static deleteInSet(set, val) {
    return [...set].filter((i) => i !== val);
  }
  
  static mergeConversations(convs, msgs) {
    const conversations = [];
    const noMessagesConvs = [];
    for (const conv of convs) {
      const msg = msgs.find((m) => m._id === conv._id.toString());
      if (msg) {
        conversations.push({
          ...msg.doc,
          members: conv.members,
          _id: conv._id.toString(),
        });
      } else {
        noMessagesConvs.push({
          _id: conv._id.toString(),
          members: conv.members,
          sender: "",
          text: "",
          conversationId: "",
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
        });
      }
    }
    return conversations
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .concat(noMessagesConvs);
  }
}

module.exports = Utils;
