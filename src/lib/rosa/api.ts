export async function getMessages(chatId: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chats/${chatId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (res.status === 404) {
      return { notFound: true };
    }
  
    const data = await res.json();
    return {
      messages: data.messages.map((msg: any) => ({
        ...msg,
        ...JSON.parse(msg.metadata),
      })),
      chat: data.chat,
    };
  }
  
  export async function getModels() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/models`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    return res.json();
  }