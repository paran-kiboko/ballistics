'use client'
import { RootState } from '@/store';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Send, Bot, User, Globe, BookOpen, Edit3, MessageCircle } from 'lucide-react';
import { setIsShowModalChat } from '@/store/admin/mainAdmin';
import Svc from '@/service/Svc';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
}

interface Language {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
}

interface ChatFunction {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
}

const ModalChat = () => {
    const isShowModalChat = useSelector((state: RootState) => state.main.isShowModalChat);
    const dispatch = useDispatch();
    const [isClosing, setIsClosing] = useState(false);

    // Language and function selection
    const [selectedLanguage, setSelectedLanguage] = useState<Language>({
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸'
    });
    const [selectedFunction, setSelectedFunction] = useState<ChatFunction>({
        id: 'general',
        name: 'General Chat',
        description: 'Natural conversation practice',
        icon: <MessageCircle className="h-4 w-4" />
    });
    const [showLanguageSelector, setShowLanguageSelector] = useState(false);
    const [showFunctionSelector, setShowFunctionSelector] = useState(false);

    const languages: Language[] = [
        { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
        { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
        { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
        { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
        { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
        { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' }
    ];

    const chatFunctions: ChatFunction[] = [
        {
            id: 'dictionary',
            name: 'Word Dictionary',
            description: 'Look up word meanings and examples',
            icon: <BookOpen className="h-4 w-4" />
        },
        {
            id: 'correction',
            name: 'Grammar Correction',
            description: 'Correct sentences and grammar',
            icon: <Edit3 className="h-4 w-4" />
        },
        {
            id: 'general',
            name: 'General Chat',
            description: 'Natural conversation practice',
            icon: <MessageCircle className="h-4 w-4" />
        }
    ];

    const getInitialMessage = () => {
        const getFunctionMessage = (func: string, lang: string) => {
            if (func === 'dictionary') {
                const dictMessages: { [key: string]: string } = {
                    'ko': '📚 **단어 사전 모드**에 오신 것을 환영합니다!\n\n**알고 싶은 영어 단어를 물어보세요:**\n\n> 단어의 뜻, 발음, 예문, 동의어까지 자세히 설명해드릴게요!\n\n**예시**: "What does \'beautiful\' mean?" 또는 "beautiful"',
                    'ja': '📚 **単語辞書モード**へようこそ！\n\n**知りたい英単語について質問してください：**\n\n> 意味、発音、例文、類義語まで詳しく説明いたします！\n\n**例**: "What does \'beautiful\' mean?" または "beautiful"',
                    'zh': '📚 欢迎使用**单词词典模式**！\n\n**请问您想了解哪个英语单词：**\n\n> 我会详细解释单词的意思、发音、例句和同义词！\n\n**例子**: "What does \'beautiful\' mean?" 或者 "beautiful"',
                    'th': '📚 ยินดีต้อนรับสู่**โหมดพจนานุกรมคำศัพท์**！\n\n**กรุณาถามเกี่ยวกับคำศัพท์ภาษาอังกฤษที่อยากรู้：**\n\n> ฉันจะอธิบายความหมาย การออกเสียง ประโยคตัวอย่าง และคำพ้องความหมายให้ฟังแบบละเอียด！\n\n**ตัวอย่าง**: "What does \'beautiful\' mean?" หรือ "beautiful"',
                    'vi': '📚 Chào mừng đến với **chế độ từ điển**！\n\n**Hãy hỏi về từ tiếng Anh bạn muốn biết：**\n\n> Tôi sẽ giải thích chi tiết về nghĩa, cách phát âm, ví dụ và từ đồng nghĩa！\n\n**Ví dụ**: "What does \'beautiful\' mean?" hoặc "beautiful"',
                    'en': '📚 Welcome to **Word Dictionary Mode**!\n\n**Ask me about any English word you want to learn:**\n\n> I\'ll provide detailed explanations including meaning, pronunciation, examples, and synonyms!\n\n**Example**: "What does \'beautiful\' mean?" or just "beautiful"'
                };
                return dictMessages[lang] || dictMessages['en'];
            } else if (func === 'correction') {
                const corrMessages: { [key: string]: string } = {
                    'ko': '✏️ **문법 교정 모드**에 오신 것을 환영합니다!\n\n**교정받고 싶은 영어 문장을 입력해주세요:**\n\n> 틀린 부분을 빨간색으로, 올바른 교정을 초록색으로 보여드리고 문법 규칙도 설명해드릴게요!\n\n**예시**: "I am go to school yesterday."',
                    'ja': '✏️ **文法添削モード**へようこそ！\n\n**添削したい英語の文章を入力してください：**\n\n> 間違っている部分を赤色で、正しい修正を緑色で表示し、文法ルールも説明いたします！\n\n**例**: "I am go to school yesterday."',
                    'zh': '✏️ 欢迎使用**语法纠正模式**！\n\n**请输入您想要纠正的英语句子：**\n\n> 我会用红色标出错误部分，用绿色显示正确修改，并解释语法规则！\n\n**例子**: "I am go to school yesterday."',
                    'th': '✏️ ยินดีต้อนรับสู่**โหมดแก้ไขไวยากรณ์**！\n\n**กรุณาใส่ประโยคภาษาอังกฤษที่ต้องการให้แก้ไข：**\n\n> ฉันจะใช้สีแดงแสดงส่วนที่ผิด สีเขียวแสดงการแก้ไขที่ถูกต้อง และอธิบายกฎไวยากรณ์ด้วย！\n\n**ตัวอย่าง**: "I am go to school yesterday."',
                    'vi': '✏️ Chào mừng đến với **chế độ sửa ngữ pháp**！\n\n**Hãy nhập câu tiếng Anh bạn muốn sửa：**\n\n> Tôi sẽ dùng màu đỏ để chỉ phần sai, màu xanh để hiển thị phần sửa đúng, và giải thích các quy tắc ngữ pháp！\n\n**Ví dụ**: "I am go to school yesterday."',
                    'en': '✏️ Welcome to **Grammar Correction Mode**!\n\n**Type the English sentence you want me to correct:**\n\n> I\'ll highlight mistakes in red, show corrections in green, and explain the grammar rules!\n\n**Example**: "I am go to school yesterday."'
                };
                return corrMessages[lang] || corrMessages['en'];
            } else {
                const generalMessages: { [key: string]: string } = {
                    'ko': '💬 **일반 대화 모드**에 오신 것을 환영합니다!\n\n**자유롭게 영어로 대화해보세요:**\n\n> 자연스러운 대화를 통해 영어 실력을 향상시켜봐요! 실수해도 괜찮아요, 제가 부드럽게 교정해드릴게요.\n\n무엇에 대해 이야기하고 싶으신가요? 🌟',
                    'ja': '💬 **一般会話モード**へようこそ！\n\n**自由に英語で会話してみてください：**\n\n> 自然な会話を通じて英語力を向上させましょう！間違いを恐れる必要はありません。優しく修正いたします。\n\n何について話したいですか？ 🌟',
                    'zh': '💬 欢迎使用**一般对话模式**！\n\n**请自由地用英语对话：**\n\n> 让我们通过自然对话来提高英语水平！不要害怕犯错，我会温和地帮您纠正。\n\n您想聊什么呢？ 🌟',
                    'th': '💬 ยินดีต้อนรับสู่**โหมดสนทนาทั่วไป**！\n\n**สนทนาภาษาอังกฤษได้อย่างอิสระ：**\n\n> มาพัฒนาทักษะภาษาอังกฤษผ่านการสนทนาธรรมชาติกันเถอะ! ไม่ต้องกลัวทำผิด ฉันจะแก้ไขให้อย่างอ่อนโยน\n\nอยากคุยเรื่องอะไรคะ？ 🌟',
                    'vi': '💬 Chào mừng đến với **chế độ trò chuyện thông thường**！\n\n**Hãy thoải mái trò chuyện bằng tiếng Anh：**\n\n> Cùng cải thiện kỹ năng tiếng Anh thông qua cuộc trò chuyện tự nhiên! Đừng sợ mắc lỗi, tôi sẽ nhẹ nhàng sửa giúp bạn.\n\nBạn muốn nói chuyện về gì？ 🌟',
                    'en': '💬 Welcome to **General Chat Mode**!\n\n**Feel free to have a conversation in English:**\n\n> Let\'s improve your English through natural conversation! Don\'t worry about mistakes - I\'ll gently help you correct them.\n\nWhat would you like to talk about? 🌟'
                };
                return generalMessages[lang] || generalMessages['en'];
            }
        };

        return getFunctionMessage(selectedFunction.id, selectedLanguage.code);
    };

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: getInitialMessage(),
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!isShowModalChat) {
            setIsClosing(false);
            return;
        }
    }, [isShowModalChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Update initial message when language or function changes
        setMessages([{
            id: '1',
            text: getInitialMessage(),
            isUser: false,
            timestamp: new Date()
        }]);
    }, [selectedLanguage, selectedFunction]);

    useEffect(() => {
        // Close dropdowns when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            setShowLanguageSelector(false);
            setShowFunctionSelector(false);
        };

        if (showLanguageSelector || showFunctionSelector) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showLanguageSelector, showFunctionSelector]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleClose = () => {
        Svc.onHaptic();
        setIsClosing(true);
        setTimeout(() => {
            dispatch(setIsShowModalChat(false));
        }, 300);
    };

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        // Create AI message with empty text for streaming
        const aiMessageId = (Date.now() + 1).toString();
        const aiMessage: Message = {
            id: aiMessageId,
            text: '',
            isUser: false,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);

        try {
            // Prepare messages for API
            const chatMessages = messages.concat(userMessage).map(msg => ({
                role: msg.isUser ? 'user' : 'assistant',
                content: msg.text
            }));

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: chatMessages,
                    language: selectedLanguage.code,
                    functionType: selectedFunction.id
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (reader) {
                let accumulatedText = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data === '[DONE]') {
                                setIsLoading(false);
                                return;
                            }

                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.content) {
                                    accumulatedText += parsed.content;
                                    setMessages(prev =>
                                        prev.map(msg =>
                                            msg.id === aiMessageId
                                                ? { ...msg, text: accumulatedText }
                                                : msg
                                        )
                                    );
                                }
                            } catch (e) {
                                // Ignore parsing errors for incomplete chunks
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === aiMessageId
                        ? { ...msg, text: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.' }
                        : msg
                )
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isShowModalChat) return null;

    return (
        <div className={`fixed inset-0 flex flex-col justify-end z-50 transition-all duration-300 ${isClosing ? 'bg-black/0' : 'bg-black/50'}`}>
            <div className="h-[10vh] bg-transparent" onClick={handleClose} />
            <div className={`bg-white rounded-t-lg flex-1 shadow-2xl animate__animated ${isClosing ? 'animate__fadeOutDown' : 'animate__fadeInUp'} animate__faster flex flex-col max-h-[90vh]`}>

                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center space-x-2">
                            <Bot className="h-6 w-6 text-blue-500" />
                            <div className="text-lg font-semibold">Chat with Emma</div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Language and Function Selection */}
                    <div className="flex items-center space-x-3">
                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <Globe className="h-4 w-4" />
                                <span className="text-sm">{selectedLanguage.flag} {selectedLanguage.nativeName}</span>
                            </button>

                            {showLanguageSelector && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setSelectedLanguage(lang);
                                                setShowLanguageSelector(false);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            <span className="mr-2">{lang.flag}</span>
                                            <span className="text-sm">{lang.nativeName}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Function Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setShowFunctionSelector(!showFunctionSelector)}
                                className="flex items-center space-x-2 px-3 py-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                {selectedFunction.icon}
                                <span className="text-sm">{selectedFunction.name}</span>
                            </button>

                            {showFunctionSelector && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-64">
                                    {chatFunctions.map((func) => (
                                        <button
                                            key={func.id}
                                            onClick={() => {
                                                setSelectedFunction(func);
                                                setShowFunctionSelector(false);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                                        >
                                            <div className="flex items-center space-x-2">
                                                {func.icon}
                                                <div>
                                                    <div className="text-sm font-medium">{func.name}</div>
                                                    <div className="text-xs text-gray-500">{func.description}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-start space-x-2 max-w-[90%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.isUser ? 'bg-blue-500' : 'bg-gray-300'}`}>
                                    {message.isUser ? (
                                        <User className="h-4 w-4 text-white" />
                                    ) : (
                                        <Bot className="h-4 w-4 text-gray-600" />
                                    )}
                                </div>
                                <div className={`rounded-lg p-3 max-w-[90vw] ${message.isUser ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}>
                                    <div className="text-sm break-words overflow-wrap-anywhere">
                                        {message.isUser ? (
                                            <div className="whitespace-pre-wrap">{message.text}</div>
                                        ) : (
                                            <div className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-4 prose-ul:text-gray-800 prose-li:text-gray-800">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                                        ul: ({ children }) => <ul className="mb-2 last:mb-0 ml-4">{children}</ul>,
                                                        ol: ({ children }) => <ol className="mb-2 last:mb-0 ml-4">{children}</ol>,
                                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                                        blockquote: ({ children }) => <blockquote className="mb-2 last:mb-0 pl-4 border-l-4 border-blue-500 bg-blue-50 py-2">{children}</blockquote>,
                                                        code: ({ children, className }) => {
                                                            const isInline = !className;
                                                            return isInline ? (
                                                                <code className="bg-gray-100 text-blue-600 px-1 py-0.5 rounded text-xs">{children}</code>
                                                            ) : (
                                                                <code className={className}>{children}</code>
                                                            );
                                                        },
                                                        h3: ({ children }) => <h3 className="font-semibold text-gray-900 mb-2 mt-3 first:mt-0">{children}</h3>,
                                                        strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                                                        em: ({ children }) => <em className="text-blue-600 font-medium">{children}</em>,
                                                    }}
                                                >
                                                    {message.text}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                    <div className={`text-xs mt-2 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {formatTime(message.timestamp)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex items-start space-x-2 max-w-[90%]">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <Bot className="h-4 w-4 text-gray-600" />
                                </div>
                                <div className="rounded-lg p-3 bg-white border border-gray-200">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center space-x-2">
                        <div className="flex-1 relative flex items-center">
                            <textarea
                                ref={inputRef}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message in English..."
                                className="w-full p-3 pr-12 border text-gray-500 border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32"
                                rows={1}
                                style={{
                                    minHeight: '44px',
                                    height: Math.min(inputText.split('\n').length * 20 + 24, 128) + 'px'
                                }}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!inputText.trim() || isLoading}
                            className="flex-shrink-0 w-11 h-11 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalChat;