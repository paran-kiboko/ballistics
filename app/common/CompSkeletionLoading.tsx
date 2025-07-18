import { cn } from "@/lib/utils"
import classNames from "classnames"


export function CompSkeletionLoading({ w, h, color }: any) {

    return (
        <div
            className={cn(
                "flex items-end space-x-2  animate-custom-pulse"
            )}
            style={{
                marginBottom: h / 8
            }}
        >
            <div
                className={cn(
                    "rounded-lg max-w-md"
                )}
                style={{
                    width: w, height: h,
                    paddingTop: h / 10,
                    paddingBottom: h / 10
                }}
            >
                <div className={classNames([
                    color || 'bg-gray-200',
                    'rounded mb-2'
                ])}
                    style={{ width: w, height: '100%' }}
                />
                {/* <div className="h-4 bg-gray-600 rounded w-1/2" /> */}
            </div>
        </div>
    )
}

