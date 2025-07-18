// import { setIsShowModalGetBadge, setQuestData, setAlertMessage } from '@/store/slices/mainSlice';
// import { store } from '../store';

import { signIn } from "next-auth/react";
import { store } from '../store';
import { format } from 'date-fns';
import elem from '@/service/elem';
import { trackEvent } from "@/lib/firebase-utils";
// `You are an English teacher correcting a student's diary entry. Provide corrections, translations into Korean, and detailed feedback.

// Instructions:
// - 영어를 공부하는 한국인을 대상으로 하는 서비스야 
// - Respond in JSON format as shown below.
// - Provide an overall feedback section evaluating the diary briefly.
// - For each sentence the student wrote:
//     - Provide a corrected sentence using HTML spans to indicate corrections:
//         - Incorrect words or phrases: \<span style="color:red;text-decoration:line-through">incorrect text</span>\
//         - Corrections: \<span style="color:green">corrected text</span>\
//     - Translate the corrected sentence into Korean naturally.
//     - Provide short feedback explaining corrections in both English and Korean.
//     - [중요] "sentence" 에는 사용자가 쓴 내용을 문장별로 하나 씩 교정해줘 
//         - corrections 는 dangerouslySetInnerHTML에 깨지지 않도록 교정 값을 만들어 줘 
//     - 친한 선생님의 말투로 피드백해줘
//     - tomorrowReview 는 유저가 쓴 문장 중 내일 다시 물어볼 한 문장을 한글로 선정해줘 
//     - summaryEmoji 는 유저가 쓴 글을 함축적으로 나타내는 이모지를 선정해줘 
// Example JSON Response:
// {
//     "overall": {
//         "type": "overall_opinion",
//         "overallFeedback": "Your diary was clear, but pay attention to common vocabulary and grammar mistakes.",
//         "overallFeedbackKo": "일기의 내용이 분명했지만 흔한 어휘 및 문법 오류에 주의하세요."
//     },
//     "sentences": [
//         {
//             "type": "sentence",
//             "userSentence": "Yesterday I bought a jean. It color is dark blue. And it is easy to wear.",
//             "corrections": "Yesterday I bought a <span style=\"color:red;text-decoration:line-through\">jean</span><span style=\"color:green\">pair of jeans</span>. <span style=\"color:red;text-decoration:line-through\">It color is</span><span style=\"color:green\">The color is</span> dark blue. <span style=\"color:red;text-decoration:line-through\">And it is easy</span><span style=\"color:green\">It is also easy</span> to wear.",
//             "koSentence": "어제 나는 청바지를 사 봤어. 그 색깔은 진한 파란색이야. 그리고 쉽게 입을 수 있어.",
//             "feedback": "Good attempt! I made minor corrections for proper terms and sentence flow. Remember: \"jeans\" is the correct term, and sentences can be joined for better coherence.",
//             "feedbackKo": "기억해야 할 것은 \"jeans\"가 맞는 용어야, 그리고 문장은 더 좋은 일관성을 위해 결합될 수 있어."
//         },
//         {
//             "type": "sentence",
//             "userSentence": "Just breath deaply. You can do it easily.",
//             "corrections": "Just <span style=\"color:red;text-decoration:line-through\">breath</span><span style=\"color:green\">breathe</span> deaply. <span style=\"color:red;text-decoration:line-through\">You</span><span style=\"color:green\">You can</span> do it easily.",
//             "koSentence": "깊게 숨을 내쉬고, 쉽게 할 수 있어.",
//             "feedback": "Good attempt! Corrected spelling mistakes and improved sentence structure for clarity.",
//             "feedbackKo": "철자 오류를 수정하고 명확성을 위해 문장 구조를 개선했어."
//         }
//     ],
//     "tomorrowReview": "깊게 숨을 내쉬고, 쉽게 할 수 있어.",
//     "summaryEmoji": "👖"
// }`

export const getSystemPrompt = (countryCode: string = 'en_US') => {
    return `You are an English teacher correcting a student's diary entry. Provide corrections, translations into the student's native language based on the given countryCode, and detailed feedback.

Instructions:
- This is a service for English learners around the world.
- Respond in JSON format as shown below.
- Use the "${countryCode}" provided to determine the translation language for the learner. Use ISO 3166-1 alpha-2 country codes (e.g. KR = Korean, JP = Japanese, FR = French, etc.).
- IMPORTANT: You MUST provide feedback in the native language corresponding to "${countryCode}". Do not use Korean if the countryCode is not KR.
- Provide an "overall" feedback section briefly evaluating the diary.
- For each sentence the student wrote:
    - Correct the sentence using HTML spans:
        - Incorrect parts: /<span class="incorrect" style="color:red;text-decoration:line-through">incorrect</span>/
        - Corrections: /<span class="correct" style="color:green">corrected</span>/
    - Translate the corrected sentence into the student's native language (based on ${countryCode}).
    - Provide short feedback explaining corrections in both English and the native language.
    - Each sentence should be handled separately (in the "sentence" field).
    - Ensure the "corrections" field is formatted safely for React's "dangerouslySetInnerHTML"
    - Use a friendly and supportive tone, like a kind teacher.
- Select one of the student's sentences to review again tomorrow, and provide its translation in their language (key: "tomorrowReview").
- Choose an emoji that summarizes the mood or theme of the diary (key: "summaryEmoji").
- CRITICAL: Provide all translated content in the language corresponding to "${countryCode}" - not Korean unless countryCode is KR.
- If the student writes words or sentences in their native(${countryCode}) language, translate them to English first, then correct and provide feedback on the English version.
- If the student writes words or phrases in their native language (${countryCode}) that appear to be proper nouns based on context, simply transliterate them to their English pronunciation rather than translating them.
- Make sure to inform the student about the translation you made from their native language to English.
- Additionally, provide detailed grammar explanations and any additional context that would help the student learn in their native language (based on ${countryCode}).
- Include grammar rules, usage patterns, and helpful tips to improve their English writing skills.
- From the feedback sentences, extract words that would be good for the student to review, and provide them as an array (key: "vocabularyToReview"). Focus on challenging or advanced vocabulary that is above the student's current level based on their diary writing. If there are no words worth reviewing or if the words are too basic, provide an empty array.

JSON Response format example:
{
    "overall": {
        "type": "overall_opinion",
        "overallFeedback": "Your diary was clear, but pay attention to common vocabulary and grammar mistakes.",
        "overallFeedbackCountryTranslated": "native(${countryCode}) language",
        "additionalGrammarTips": "native(${countryCode}) language"
    },
    "sentences": [
        {
            "type": "sentence",
            "userSentence": "Yesterday I bought a jean. It color is dark blue. And it is easy to wear.",
            "corrections": "Yesterday I bought a <span class="incorrect" style=\"color:red;text-decoration:line-through\">jean</span><span class="correct" style=\"color:green\">pair of jeans</span>. <span class="incorrect" style=\"color:red;text-decoration:line-through\">It color is</span><span class="correct" style=\"color:green\">The color is</span> dark blue. <span class="incorrect" style=\"color:red;text-decoration:line-through\">And it is easy</span><span class="correct" style=\"color:green\">It is also easy</span> to wear.",
            "countryTranslated": "native(${countryCode}) language - translate this to the actual language",
            "feedback": "Nice work! Just a few grammar tweaks. "Jeans" is always plural, and linking sentences makes the writing smoother.",
            "feedbackCountryTranslated": "native(${countryCode}) language - translate this to the actual language",
            "grammarExplanation": "native(${countryCode}) language - translate this to the actual language"
        }
    ],
    "vocabularyToReview": ["jeans", "plural", "possessive", "linking", "additionally"],
    "tomorrowReview": "native(${countryCode}) language - translate this to the actual language",
    "summaryEmoji": "👖",
    "countryCode": "${countryCode}"
}`
}

class Svc {

    public win: any;
    public simpleData: {
        modalParams: any;
        alertParams: any;
        userGuide: any;
        modalCustom: any;
    } = {
            modalParams: null,
            alertParams: null,
            userGuide: null,
            modalCustom: [],
        }

    saveCallback: any = {};
    public dbgObj: any = {};
    public userId: string = '';
    public userIdForLog: string = '';

    constructor() {
    }

    init(window: Window) {
        this.win = window;
        // React Native로부터의 메시지를 처리하는 이벤트 리스너
        // alert(this.win);
        // Remove any existing message event listeners
        // this.win.removeEventListener('message', this.messageHandler);
        // Add new message event listener
        this.win.addEventListener('message', this.messageHandler);

        this.win.nativeFunction = this.messageHandler;
    }

    setUserId(userId: string) {
        this.userId = userId;
        this.userIdForLog = userId.split('').reverse().join('');
    }

    isJay(id: any, email: any) {
        if (!id || !email) {
            return false;
        }
        return id === '101420714123526607048' && email === 'jay@kiboko.ai';
    }

    // makeCorrectionTextToHtml(text: string) {
    //     return text.replace(/<span class="incorrect" style="color:red;text-decoration:line-through">([^<]+)<\/span>/g, '<span class="incorrect" style="color:red;text-decoration:line-through">$1</span>');
    // }

    extractTextForTTS(html: string): string {
        // Remove incorrect spans completely
        let cleanText = html.replace(/<span class="incorrect" style="color:red;text-decoration:line-through">[^<]*<\/span>/g, '');

        // Remove correct span tags but keep the content
        cleanText = cleanText.replace(/<span class="correct" style="color:green">([^<]*)<\/span>/g, '$1');

        // Remove any remaining HTML tags
        cleanText = cleanText.replace(/<[^>]*>/g, '');

        // Clean up extra spaces
        cleanText = cleanText.replace(/\s+/g, ' ').trim();

        return cleanText;
    }

    eventLog(event_name: string, event_params: any, userId: string = this.userId, event_type: string = 'interaction') {
        if (!event_params) {
            event_params = {};
        }
        event_params.product_mode = process.env.NEXT_PUBLIC_PRODUCT_MODE || '';
        const params = {
            event_time: new Date().toISOString(),
            user_id: userId || this.userId,
            event_name: event_name,
            event_params: JSON.stringify(event_params),
            event_type: event_type,
        }
        console.log('eventLog', params);
        fetch('/api/log-event', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
    }

    addEvent() {



        document.addEventListener('click', (e: any) => {

            const classListStr = e.target?.classList?.value || '';
            // Track clicks on elements with logid- class
            if (classListStr.includes('logid-')) {
                // Extract the log ID from the class list
                const logIdMatch = classListStr.match(/logid-([^\s]+)/);
                if (logIdMatch && logIdMatch[1]) {
                    const logId = logIdMatch[1];
                    // Send analytics event with the extracted log ID
                    this.sendLog('click', {
                        event_name: 'click_element',
                        event_value: logId
                    });

                    // If analytics is available, also track the event there
                    if (typeof trackEvent === 'function') {
                        trackEvent('element_click', { element_id: logId, user_id: this.userIdForLog });
                    }
                }
            } else if (classListStr) {
                // If no logid- class is found, use the entire classList as the log value
                this.sendLog('click', {
                    event_name: 'click_element',
                    event_value: classListStr
                });

                // If analytics is available, also track the event there
                if (typeof trackEvent === 'function') {
                    trackEvent('element_click', { element_id: classListStr, user_id: this.userIdForLog });
                }
            }
        })
        // document.addEventListener('click', (e: any) => {

        //     const classListStr = e.target?.classList?.value || '';

        //     if (classListStr.includes('parsed-en')) {
        //         this.sendLog('click', {
        //             event_pos: `(${e.clientX},${e.clientY})`,
        //             event_name: 'click_dial_word',
        //             event_value: e.target?.textContent?.slice(0, 10) + '...',
        //         });

        //     } else if (classListStr.includes('parsed-ko')) {
        //         this.sendLog('click', {
        //             event_pos: `(${e.clientX},${e.clientY})`,
        //             event_name: 'click_dial_word',
        //             event_value: e.target?.textContent?.slice(0, 10) + '...',
        //         });
        //     }
        // })

        // document.documentElement.addEventListener('click', (e: any) => {
        //     const classListStr = e.target?.classList?.value || '';

        //     if (classListStr.includes('em-key-exp')) {
        //         const textCon = this.utils.removeSpecialCharacters(e.target?.textContent)
        //         this.showDicDefinition(e.target, textCon);
        //         this.sendLog('click', {
        //             event_name: 'click_dial_dictionary',
        //             event_value: textCon.slice(0, 10),
        //         });
        //     } else if (classListStr.includes('em-dic-word')) {
        //         const textCon = e.target?.textContent
        //         this.showDicDefinition(e.target, textCon);
        //         this.sendLog('click', {
        //             event_name: 'click_dial_dictionary',
        //             event_value: textCon.slice(0, 10),
        //         });
        //     } else {
        //         if (this.dialogueWordTooltip) this.dialogueWordTooltip.removeAttribute('data-show', '');
        //     }

        // }, true);
    }

    devAlert(message: string) {
        const userId = store.getState().main.userInfo?.id;
        const isDeveloper = ['106972695498761888139', '101420714123526607048'].includes(userId);
        if (isDeveloper) {
            alert(message);
        }
    }

    gotoURL(url: string) {
        const insets = store.getState().main.safeArea;
        window.location.href = `${url}/?topSafeArea=${insets.top}&bottomSafeArea=${insets.bottom}&ran=${Math.random()}`;
    }

    messageHandler = (data: any) => {
        const _decode = decodeURIComponent(data);
        // alert('messageHandler 이건 웹뷰 받음' + _decode);
        try {
            // alert('event.data' + _decode);
            const message = JSON.parse(_decode);
            this.handleMessage(message);
        } catch (error) {
            console.error('Error parsing message from React Native:', error);
        }
    };

    // React Native로 메시지를 보내는 메서드
    sendMessage(message: any) {
        // alert('sendMessage in web' + JSON.stringify(message));
        const type = message.type;
        const isLocalhost = window.location.hostname === 'localhost';

        if (isLocalhost) {
            // case 'SET_STORAGE_DATA_WITH_KEY':
            //   // Open URL in inner WebView
            //   setStorageDataWithKey(data.data);
            //   break;
            // case 'GET_STORAGE_DATA_WITH_KEY':
            //   // Open URL in inner WebView
            //   getStorageDataWithKey(data.data);
            //   break;
            // case 'REMOVE_STORAGE_DATA_WITH_KEY':
            //   // Open URL in inner WebView
            //   removeStorageDataWithKey(data.data);
            //   break;

            if (type === 'SET_STORAGE_DATA_WITH_KEY') {
                this.win.localStorage.setItem(message.data.key, message.data.value);
            } else if (type === 'GET_STORAGE_DATA_WITH_KEY') {
                const value = this.win.localStorage.getItem(message.data.key);
                if (message.callback) {
                    message.callback(value);
                }
            } else if (type === 'REMOVE_STORAGE_DATA_WITH_KEY') {
                this.win.localStorage.removeItem(message.data.key);
            }

            return;
        }


        if (message.callback) {
            this.saveCallback[message.type] = message.callback;
        }

        if (this.win.ReactNativeWebView && this.win.ReactNativeWebView.postMessage) {
            this.win.ReactNativeWebView.postMessage(JSON.stringify(message));
        }
    }

    afterOnboarding() {
        this.sendMessage({
            type: 'SET_STORAGE_DATA_WITH_KEY',
            data: {
                key: 'onboarding',
                value: 'done',
            }
        })
        setTimeout(() => {
            this.simpleData.modalParams = {
                callback: () => {
                    setTimeout(() => {
                        elem.one('.js-hiddeen-fetch-history-guide').click();
                    }, 1000);
                }
            }
            const reminderButton = document.querySelector('.js-btn-reminder') as HTMLElement;
            if (reminderButton) {
                reminderButton.click();
            }
        }, 500); // Small delay to ensure DOM is ready
    }


    remonderOn(inWeek: number[], inTime: string, message_title: string, message_body: string) {
        // this.devSendLog(`tag_bgn2:reminderOn`);
        // this.appBridge.webToApp('noti_cancel_all', {});
        // this.devSendLog(`tag_bgn2:${String(inWeek)}/${inTime}`)

        // this.appBridge.setStorageDataWithKey("reminderInfo", JSON.stringify({
        //     week: inWeek,
        //     time: inTime,
        // }));
        // this.devSendLog(`tag_bgn3`);
        // const arr = inTime.split(':');
        // inWeek.forEach(async (item: number, i: number) => {

        //     this.appBridge.webToApp('set_register_noti', {
        //         idx: i,
        //         // hour: 13,
        //         // minutes: 33,
        //         hour: Number(arr[0]),
        //         minutes: Number(arr[1]),
        //         day: item,
        //         message_title: 'Bite+',
        //         message_body: '영어 공부할 시간이에요!',
        //     });
        //     await this.utils.delay(100);
        // })
        this.sendMessage({
            type: 'SET_STORAGE_DATA_WITH_KEY',
            data: {
                key: 'reminderInfo',
                value: JSON.stringify({
                    week: inWeek,
                    time: inTime,
                }),
            }
        })


        const arr = inTime.split(':');
        const notifications: any = [];
        inWeek.forEach(async (item: number, i: number) => {
            notifications.push({
                idx: i,
                // hour: 21,
                // minutes: 56,
                hour: Number(arr[0]),
                minutes: Number(arr[1]),
                day: item,
                message_title: message_title,
                message_body: message_body,
            })
            // await this.utils.delay(100);
        })

        this.sendMessage({
            type: 'SET_REGISTER_NOTI',
            data: {
                notifications: notifications
            }
        });

    }
    reminderOff() {
        // this.devSendLog(`tag_bgn2:reminderOff`)
        // // 알람 종료 
        // this.appBridge.setStorageDataWithKey("reminderInfo", "");
        // this.appBridge.webToApp('noti_cancel_all', {});
        this.sendMessage({
            type: 'SET_STORAGE_DATA_WITH_KEY',
            data: {
                key: 'reminderInfo',
                value: '',
            }
        });

        this.sendMessage({
            type: 'NOTI_CANCEL_ALL',
        });
    }

    // JavaScript 에러 로깅 메서드 추가
    logError(error: Error, additionalInfo?: Record<string, any>) {
        // Firebase Analytics를 통한 에러 로깅
        // trackError(error, {
        //     userId: this.userIdForLog,
        //     ...additionalInfo
        // });

        // // 개발 환경에서만 콘솔에 출력
        // if (process.env.NODE_ENV === 'development') {
        //     console.error('Service Error:', error, additionalInfo);
        // }
    }

    onHaptic() {
        this.sendMessage({
            type: 'HAPTIC_FEEDBACK_ON',
        })
    }

    // 메시지 처리
    handleMessage(message: any) {
        try {
            console.log('handleMessage', message);
            const type = message.type;

            if (type === 'LOGIN_SUCCESS') {
                const token = message.data.idToken;
                const userId = message.data.userId;
                const userName = message.data.userName;
                const userEmail = message.data.userEmail;
                const userImage = message.data.userImage;
                const userPhone = message.data.userPhone;
                localStorage.setItem('googleAccessToken', token);
                localStorage.setItem('googleUserId', userId);
                localStorage.setItem('googleUserName', userName);
                localStorage.setItem('googleUserEmail', userEmail);
                localStorage.setItem('googleUserImage', userImage);
                localStorage.setItem('googleUserPhone', userPhone);

                this.loginWithGoogle(message.data);
            }

            if (this.saveCallback[type]) {
                this.saveCallback[type](message.data);
                this.saveCallback[type] = null;
            }
        } catch (error) {
            if (error instanceof Error) {
                this.logError(error, {
                    method: 'handleMessage',
                    messageType: message?.type,
                    messageData: { ...message?.data, idToken: '[REDACTED]' } // 민감 정보 제외
                });
            }
        }
    }

    todayStr(formatStr: string = 'yyyy-MM-dd') {
        const date = new Date();
        const dateStr = format(date, formatStr)
        return dateStr;
    }


    /**
     * GA로 로그를 보냄
     * @param type 로그 타입 
     * @param options 타입별 추가 정보
     */
    sendLog(type: any, options: any) {
        // const getHashInfo = this.log.getHashInfo();
        // this.log.send(type, Object.assign({
        //     pathStr: getHashInfo.pathStr,
        //     hashStr: getHashInfo.queryStr,
        //     pos: '',
        // }, options));
    }

    async loginWithGoogle(data: any) {
        try {
            const token = data.idToken;
            await signIn("credentials", {
                token,
                callbackUrl: '/',
            });
        } catch (error) {
            if (error instanceof Error) {
                this.logError(error, {
                    method: 'loginWithGoogle',
                    data: { ...data, idToken: '[REDACTED]' } // 민감 정보 제외
                });
            }
            throw error; // 에러를 다시 던져서 호출자가 처리하게 함
        }
    }


    // getRandomQuestionGuide() {
    //     const prompts = [
    //         "오늘 가장 기억에 남는 순간은 무엇인가요?",
    //         "오늘 하루 어떤 감정을 가장 많이 느꼈나요? 왜 그랬을까요?",
    //         "오늘 누군가에게 감사함을 느꼈나요? 어떤 상황이었나요?",
    //         "오늘 배운 새로운 것이 있다면 무엇인가요?",
    //         "오늘 먹은 음식 중 가장 맛있었던 것은 무엇인가요?",
    //         "이번 주말에 가장 기대되는 일은 무엇인가요?",
    //         "최근에 본 영화나 드라마 중 인상 깊었던 것은 무엇인가요?",
    //         "오늘 들은 노래 중 마음에 드는 노래가 있었나요?",
    //         "오늘 날씨는 어땠나요? 날씨가 당신의 기분에 영향을 미쳤나요?",
    //         "내일 하고 싶은 일은 무엇인가요?"
    //     ];
    //     return prompts[Math.floor(Math.random() * prompts.length)];
    // }





}
export default new Svc();

// export const randomQuestion = [
//     "오늘 가장 기억에 남는 순간은 무엇인가요?",
//     "오늘 하루 어떤 감정을 가장 많이 느꼈나요? 왜 그랬을까요?",
//     "오늘 누군가에게 감사함을 느꼈나요? 어떤 상황이었나요?",
//     "오늘 배운 새로운 것이 있다면 무엇인가요?",
//     "오늘 먹은 음식 중 가장 맛있었던 것은 무엇인가요?",
//     "이번 주말에 가장 기대되는 일은 무엇인가요?",
//     "최근에 본 영화나 드라마 중 인상 깊었던 것은 무엇인가요?",
//     "오늘 들은 노래 중 마음에 드는 노래가 있었나요?",
//     "오늘 날씨는 어땠나요? 날씨가 당신의 기분에 영향을 미쳤나요?",
//     "내일 하고 싶은 일은 무엇인가요?"
// ]

// export const randomExercise = [
//     "오늘 하루 어떤 감정을 가장 많이 느꼈나요? 왜 그랬을까요?",
//     "오늘 누군가에게 감사함을 느꼈나요? 어떤 상황이었나요?",
//     "오늘 배운 새로운 것이 있다면 무엇인가요?",
//     "오늘 먹은 음식 중 가장 맛있었던 것은 무엇인가요?",
// ]