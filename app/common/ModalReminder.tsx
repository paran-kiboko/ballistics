'use client'
import { RootState } from '@/store';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X } from 'lucide-react';
import { setIsShowReminder, setAlertMessage, setOnTime, setUserGuideMessage } from '@/store/admin/mainAdmin';
// import SVGArrowLeff from '@/assets/SVGArrowLeff';
import Svc from '@/service/Svc';
import Switch from "react-switch";
import classNames from 'classnames';
import Image from 'next/image';
import elem from '@/service/elem';
import { useTranslation } from 'react-i18next';
const timeList = [
    "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30", "00:00", "00:30", "01:00"
];
let defaultTime = '19:30';
const ModalReminder = () => {
    const isShowReminder = useSelector((state: RootState) => state.main.isShowReminder);
    const dispatch = useDispatch();
    const [isClosing, setIsClosing] = useState(false);
    const [isShowSelectWeek, setIsShowSelectWeek] = useState(false);
    const [isShowSelectTime, setIsShowSelectTime] = useState(false);
    const [switchOn, setSwitchOn] = useState(false);
    // const [selectTime, setSelectTime] = useState('19:30');
    const [selectWeek, setSelectWeek] = useState([0, 1, 2, 3, 4, 5, 6]);
    const onTime = useSelector((state: RootState) => state.main.onTime);
    const { t } = useTranslation();
    // const [timeList, setTimeList] = useState(timeList);

    useEffect(() => {
        if (!isShowReminder) {
            setIsClosing(false);
        }
        set2SelectTime(onTime);
        setSwitchOn(onTime ? true : false);

        if (!onTime) {
            setTimeout(() => {
                if (elem.one('.js-btn-set-time')) elem.one('.js-btn-set-time').click();
            }, 100);
        }
    }, [isShowReminder, onTime]);

    const handleClose = () => {
        Svc.onHaptic();
        setIsClosing(true);
        setTimeout(() => {
            if (Svc.simpleData.modalParams?.callback) {
                Svc.simpleData.modalParams.callback();
            }
            dispatch(setIsShowReminder(false));

        }, 300); // Animation duration
    };

    const set2SelectTime = (val: any) => {
        // selectTimeDirect = val;
        dispatch(setOnTime(val));
    }

    const setupReminder = (inTime: string = '') => {

        // Svc.devAlert('setupReminder1::' + inTime);

        Svc.sendMessage({
            type: 'NOTI_REQUEST_PERMISSIONS_SECOND',
            callback: (result: any) => {
                console.log('NOTI_REQUEST_PERMISSIONS_SECOND', result);
                if (String(result.state) === 'true') {
                    // setTimeout(() => {

                    //     Svc.remonderOn(selectWeek, onTime);

                    // }, 100);
                    // Svc.devAlert('setupReminder2::' + inTime);
                    if (!inTime) {
                        inTime = defaultTime;

                    }

                    // Svc.devAlert('setupReminder3::' + inTime);
                    setIsShowSelectTime(false);
                    set2SelectTime(inTime);
                    setSwitchOn(true);

                    Svc.remonderOn(
                        selectWeek,
                        inTime,
                        'Reno Diary',
                        t('reminder1')
                    );
                    // Svc.remonderOn(selectWeek, '20:38');
                    Svc.simpleData.userGuide = {
                        emoji: '🔔',
                        isNextIcon: false,
                        duration: 99999,
                    }
                    dispatch(setUserGuideMessage(t('guide4')));

                } else {
                    setTimeout(() => {
                        setSwitchOn(false);
                    }, 300);
                    // Svc.alertOptions = {
                    //     message: '시스템 알림(notification)이 <br>비활성화 상태입니다. <br>설정 메뉴에서 허용해 주세요.',
                    //     isConfirm: true,
                    //     confirmLabel: '설정 확인',
                    //     cancelLabel: '취소',
                    //     callback: async (result: any) => {
                    //         if (result === 'cancel') return;
                    //         Svc.appBridge.webToApp('open_app_settings', {});
                    //     }
                    // };

                    Svc.simpleData.alertParams = {
                        title: t('txt8'),
                        message: t('guide19'),
                        isConfirm: true,
                        confirmText: t('btn10'),
                        callback: () => {
                            // Svc.appBridge.webToApp('open_app_settings', {});
                            Svc.sendMessage({
                                type: 'OPEN_APP_SETTINGS',
                            });
                        }
                    }

                    dispatch(setAlertMessage(t('guide19')))
                }
            }
        })

    }

    if (!isShowReminder) return null;

    return (
        <div className={`setupReminder fixed inset-0 flex flex-col justify-end z-50 transition-all duration-300 ${isClosing ? 'bg-black/0' : 'bg-black/50'}`}>
            <div className="h-[10vh] bg-transparent" onClick={handleClose} />
            <div className={`bg-white rounded-t-lg flex-1 shadow-2xl animate__animated ${isClosing ? 'animate__fadeOutDown' : 'animate__fadeInUp'} animate__faster flex flex-col max-h-[90vh]`}>
                <div className="p-[18px]">
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className="text-xl font-medium">{t('txt9')}</div>
                        <div className="w-6"></div>
                    </div>

                    {isShowSelectTime && <CompSetTime
                        selectTime={onTime}
                        onConfirm={(val: string) => {

                            Svc.sendLog('click', {
                                page_id: 'bottomsheet-reminder',
                                event_name: 'click_reminder_time',
                                event_value: val,
                            });

                            // set2SelectTime(val);



                            setTimeout(() => {
                                setupReminder(val);


                            }, 100);
                        }}
                        onClose={() => {
                            setIsShowSelectTime(false);
                        }}
                    />}
                    {isShowSelectWeek && <CompSetWeek
                        selectWeek={selectWeek}
                        onConfirm={(inWeek: any) => {

                            // Svc.sendLog('click', {
                            //     page_id: 'bottomsheet-reminder',
                            //     event_name: 'click_reminder_confirm',
                            //     event_value: String(inWeek),
                            // });

                            setIsShowSelectWeek(false);
                            setSwitchOn(true);
                            setTimeout(() => {
                                setupReminder();
                            }, 100);

                        }}
                        onClose={() => {
                            setIsShowSelectWeek(false);
                        }}
                        onChange={(val: any) => {

                            val.sort();
                            if (val.length === 0) {
                                alert(t('guide20'))
                                return;
                            }
                            setSelectWeek(val);
                        }}
                    />}

                    <div className="wrap-content">
                        <div className="wrap-message">
                            {/* <Image src="/assets/imgs/alerm-clock-ms.png" alt="" className="alarm"
                                width={70}
                                height={70} /> */}
                            <div className="label">{t('guide21')}

                                {/* <div className="swite-state">
                                    <span className="label-ko">알림</span>
                                    <span className="state-en">{switchOn ? 'ON' : 'OFF'}</span>
                                </div> */}
                            </div>
                            <div className="onoff">{switchOn ? 'ON' : 'OFF'}</div>
                            <Switch
                                className="switch-ui"
                                onColor="#3B43FB"
                                uncheckedIcon={false}
                                checkedIcon={false}
                                onChange={(result: any) => {
                                    Svc.onHaptic();
                                    // Svc.devSendLog(`tag_1oc:${result}`);
                                    // Svc.sendLog('click', {
                                    //     page_id: 'bottomsheet-reminder',
                                    //     event_name: 'click_reminder_btn',
                                    //     event_value: result ? 'ON' : 'OFF'
                                    // });

                                    if (result) {
                                        setTimeout(() => {
                                            setupReminder();
                                        }, 100);
                                    } else {
                                        // 끄기 
                                        Svc.reminderOff();
                                        dispatch(setOnTime(''));
                                    }
                                    setSwitchOn(result);

                                }} checked={switchOn} />

                        </div>
                        <div className="desc" dangerouslySetInnerHTML={{ __html: t('guide22') }}></div>
                        <div className={classNames(["wrap-setting-ctrl", { on: switchOn }])}>
                            <div className="btns">
                                <div className="btn-set btn-set-time js-btn-set-time" onClick={() => {
                                    Svc.onHaptic();
                                    Svc.sendLog('click', {
                                        page_id: 'bottomsheet-reminder',
                                        event_name: 'click_reminder_date',
                                    });

                                    setIsShowSelectTime(true);
                                    setTimeout(() => {
                                        const gotoIdx = timeList.indexOf(onTime || defaultTime);
                                        elem.one('.js-time-scroll-wrap').scrollTo(0, 48 * gotoIdx - 150 + (48 / 2));

                                    }, 500);

                                }}>{onTime || defaultTime}</div>
                                <div className="btn-set btn-set-week" onClick={() => {
                                    Svc.onHaptic();
                                    Svc.sendLog('click', {
                                        page_id: 'bottomsheet-reminder',
                                        event_name: 'click_reminder_period',
                                    });

                                    setIsShowSelectWeek(true);
                                }}>{(() => {
                                    const str = String(selectWeek);

                                    if (str === '0,6') {
                                        return t('guide23');
                                    } else if (str === '1,2,3,4,5') {
                                        return t('guide24');
                                    } else if (selectWeek.length === 7) {
                                        return t('guide25');
                                    }
                                    return String(selectWeek.map((item: any) => {
                                        return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][item]
                                    }))
                                    // return '매일';
                                })()}</div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ModalReminder;

const CompSetTime = ({
    selectTime,
    onConfirm,
    onClose,
}: {
    selectTime?: string,
    onConfirm: Function,
    onClose: Function,
}) => {
    const { t } = useTranslation();
    return <div className="wrap-modal" style={{
        paddingBottom: '100px'
    }}>
        <div className="in-modal" style={{
            height: '400px',

        }}>
            <div className="modal-header">
                <div className="left"></div>
                <div className="center">
                    {t('guide27')}
                </div>
                <div className="right">
                    <div className="btn-close" onClick={() => {
                        Svc.onHaptic();
                        onClose();
                    }}>

                        <X className="h-6 w-6" />
                    </div>
                </div>
            </div>
            <div className="modal-main js-time-scroll-wrap" style={{
                alignItems: 'flex-start',
                height: '300px',
                overflowY: 'scroll'
            }}>
                <ul className="ul-blank times">
                    {(() => {
                        return timeList.map((item: string, i: number) => {
                            const arr = item.split(':');
                            return <li className={classNames(["time-opt", { active: selectTime === item }, { even: i % 2 === 1 }])}
                                onClick={() => {
                                    Svc.onHaptic();
                                    onConfirm(item);

                                    onClose();
                                }}
                                key={`time-opt-${i}`}>
                                <span className="hour">{arr[0]}:</span><span className="min">{arr[1]}</span>
                            </li>;
                        })
                    })()}
                </ul>
                {/* <CompPickerBase pickId='pickDayNight' />
            <CompPickerBase pickId="pickHour" />
            <CompPickerBase pickId="pickMin" /> */}
            </div>
            {/* <div className="modal-footer">
                <div className="btn-confirm" onClick={() => {

                }}>확인</div>
            </div> */}
        </div>
    </div>
}

const CompSetWeek = ({
    selectWeek,
    onConfirm,
    onClose,
    onChange,
}: {
    selectWeek: any,
    onConfirm: Function,
    onClose: Function,
    onChange: Function,
}) => {
    console.log('selectWeek', selectWeek);
    const { t } = useTranslation();

    const CompBtnDays = [0, 1, 2, 3, 4, 5, 6].map((idx: number) => {
        return <li className={classNames(["btn-day", { active: selectWeek?.includes(idx) }])} onClick={() => {
            Svc.onHaptic();
            const copyArr = selectWeek.slice(0);

            if (copyArr.includes(idx)) {
                const arr2 = copyArr.filter((item: any) => {
                    return item !== idx
                })
                onChange(arr2);
            } else {
                copyArr.push(idx);
                onChange(copyArr);
            }
        }}>{['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][idx]}</li>;
    })

    return <div className="wrap-modal" style={{
        paddingBottom: '100px'

    }}>
        <div className="in-modal">
            <div className="modal-header">
                <div className="left"></div>
                <div className="center">
                    {t('guide26')}
                </div>
                <div className="right">
                    <div className="btn-close" onClick={() => {
                        Svc.onHaptic();
                        onClose();
                    }}>
                        {/* <FontAwesomeIcon icon={faClose} /> */}
                        {/* <img src="/assets/imgs/faClose.svg" alt="" className="faClose" /> */}
                        <X className="h-6 w-6" />
                    </div>
                </div>
            </div>
            <div className="modal-main">
                <div className="CompWeekPicker">
                    <div className="summary">{(() => {
                        const str = String(selectWeek);

                        if (str === '0,6') {
                            return t('guide23');
                        } else if (str === '1,2,3,4,5') {
                            return t('guide24');
                        } else if (selectWeek.length === 7) {
                            return t('guide25');
                        }
                        return String(selectWeek.map((item: any) => {
                            return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][item]
                        }))
                        // return '매일';
                    })()}</div>
                    <ul className="ul-blank btns-day">

                        {CompBtnDays}
                    </ul>
                </div>
            </div>
            <div className="modal-footer">
                <div className="btn-confirm" onClick={() => {
                    Svc.onHaptic();
                    // alert(selectWeek);
                    onConfirm(selectWeek);
                    return;


                }}>{t('btn1')}</div>
            </div>
        </div>
    </div>
}