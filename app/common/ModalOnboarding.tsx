"use client"

import { useEffect, useState, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation, EffectFade } from "swiper/modules"
import { useSwiper } from "swiper/react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useDispatch } from "react-redux";
import { setIsShowOnboarding } from "@/store/admin/mainAdmin";
import Image from "next/image"
import Svc from "@/service/Svc";
import type { Swiper as SwiperType } from 'swiper';
// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/effect-fade"

const onboardingData = [
    {
        id: 1,
        color: "#4285F4", // 파란색
        title: "당신의 생각을,<br>영어로 적어보세요",
        subtitle: "자유롭게 일기를 써보세요",
        description: "서툴러도 괜찮아요.<br>매일 쓰는 습관이 영어 표현력을 키워줍니다.",
        image: "/imgs/onboarding1.png",
    },
    {
        id: 2,
        color: "#FBBC05", // 노란색
        title: "뭘 써야 할지 고민되시나요?",
        subtitle: "Reno가 질문으로 도와드릴게요",
        description: "랜덤 질문을 통해 자연스럽게 영어 글쓰기를 시작할 수 있어요.",
        image: "/imgs/onboarding2.png",
    },
    {
        id: 3,
        color: "#34A853", // 초록색
        title: "한 문장부터 시작해도 좋아요",
        subtitle: "예시 문장을 보고 따라 써보세요",
        description: "하루의 감정을 한 문장으로 표현하며,<br>조금씩 자신감을 얻어요.",
        image: "/imgs/onboarding3.png",
    },
    {
        id: 4,
        color: "#FF9900", // 주황색
        title: "문장마다 꼼꼼한 피드백 제공",
        subtitle: "교정 + 학습 포인트까지 한눈에!",
        description: "당신이 쓴 문장을 하나하나 다듬어주며<br>성장으로 이어집니다.",
        image: "/imgs/onboarding4.png",
    },
    {
        id: 5,
        color: "#A142F4", // 보라색
        title: "매일 쓰는 습관,<br>알림으로 이어가요",
        subtitle: "하루 한 번, 영어 일기 리마인더!",
        description: "꾸준함이 실력을 만듭니다. 알림을 켜고 매일 Reno와 함께하세요.",
        image: "/imgs/onboarding5.png",
    },
]

const NavigationButtons = () => {
    const swiper = useSwiper()
    const [isBeginning, setIsBeginning] = useState(true)
    const [isEnd, setIsEnd] = useState(false)
    const dispatch = useDispatch();
    useEffect(() => {
        if (!swiper) return

        const handleSlideChange = () => {
            setIsBeginning(swiper.isBeginning)
            setIsEnd(swiper.isEnd)
        }

        swiper.on("slideChange", handleSlideChange)
        return () => {
            swiper.off("slideChange", handleSlideChange)
        }
    }, [swiper])

    return (
        <div className="absolute bottom-6 left-0 right-0 z-10 flex justify-between px-6">
            <button
                onClick={() => swiper.slidePrev()}
                className={`flex h-10 w-10 items-center justify-center rounded-full ${isBeginning ? "bg-gray-200 text-gray-400" : "bg-white text-gray-700 shadow-md"
                    }`}
                disabled={isBeginning}
            >
                <ChevronLeft size={20} />
            </button>
            {
                isEnd ? (
                    <button
                        onClick={() => {

                            if (isEnd) {
                                dispatch(setIsShowOnboarding(false));
                                Svc.afterOnboarding();
                            }
                        }}
                        className={`flex h-10 px-4 items-center justify-center rounded-full bg-white text-gray-700 shadow-md font-medium`}

                    >
                        Start
                    </button>
                ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-md" onClick={() => swiper.slideNext()}>
                        <ChevronRight size={20} />
                    </div>
                )}
        </div>
    )
}

export default function ModalOnboarding() {
    const [showModal, setShowModal] = useState(true)
    const swiperRef = useRef(null)
    const dispatch = useDispatch();
    const handleSlideChange = (swiper: SwiperType) => {
        if (swiper.isEnd && swiper.activeIndex === onboardingData.length - 1) {
            // 마지막 슬라이드에 도달했을 때 이벤트 리스너 추가
            swiper.on("slideChangeTransitionEnd", () => {
                if (swiper.isEnd) {
                    // 마지막 슬라이드의 트랜지션이 끝났을 때 알림 표시
                    // setTimeout(() => {
                    //     dispatch(setIsShowOnboarding(false))
                    //     Svc.afterOnboarding();
                    //     setShowModal(false)
                    // }, 5000)
                }
            })
        }
    }

    if (!showModal) {
        return '';
    }

    return (
        <div className="relative mx-auto w-[90%] h-[80%] overflow-hidden rounded-xl bg-white shadow-2xl">
            <Swiper
                ref={swiperRef}
                modules={[Pagination, Navigation, EffectFade]}
                pagination={{
                    clickable: true,
                    renderBullet: (index, className) =>
                        `<span class="${className}" style="background-color: ${onboardingData[index].color}"></span>`,
                }}
                onSlideChange={handleSlideChange}
                className="h-full w-full"
            >
                {onboardingData.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div
                            className="flex h-full w-full flex-col items-center justify-center p-8"
                            style={{ backgroundColor: `${slide.color}10` }}
                        >
                            <div className="mb-6 relative min-h-[180px] h-full w-[96%]">
                                <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill className="object-contain" />
                            </div>
                            <h2 className="mb-2 text-center text-2xl font-bold" style={{ color: slide.color }}
                                dangerouslySetInnerHTML={{ __html: slide.title }}
                            >

                            </h2>
                            <h3 className="mb-4 text-center text-xl font-medium text-gray-700"
                                dangerouslySetInnerHTML={{ __html: slide.subtitle }}
                            >

                            </h3>
                            <p className="text-center text-gray-600"
                                dangerouslySetInnerHTML={{ __html: slide.description }}
                            >
                            </p>
                            <div className="mt-8 h-1 w-16 rounded" style={{ backgroundColor: slide.color }}></div>
                        </div>
                    </SwiperSlide>
                ))}
                <NavigationButtons />
            </Swiper>
        </div>
    )
}
