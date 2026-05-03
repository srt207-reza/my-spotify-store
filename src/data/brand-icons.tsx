import Image from "next/image";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

type IconProps = Omit<ComponentProps<typeof Image>, "src" | "alt"> & {
    className?: string;
};

function createIcon(src: string, alt: string) {
    return function Icon({ className, ...props }: IconProps) {
        return (
            <Image
                src={src}
                alt={alt}
                width={32}
                height={32}
                className={cn("object-contain", className)}
                {...props}
            />
        );
    };
}

const BrandIcons = {
    CollaborativePlaylist: createIcon("/assets/images/icons/collaborative_playlist.png", "Collaborative Playlist"),
    CustomOrder: createIcon("/assets/images/icons/custom_order.png", "Custom Order"),
    EmailActivation: createIcon("/assets/images/icons/email_activation.png", "Email Activation"),
    GroupListen: createIcon("/assets/images/icons/group_listen.png", "Group Listen"),
    HighQuality: createIcon("/assets/images/icons/high_quality.png", "High Quality"),
    MultiDevice: createIcon("/assets/images/icons/multi_device.png", "Multi Device"),
    NoAds: createIcon("/assets/images/icons/no_ads.png", "No Ads"),
    OfflineDownload: createIcon("/assets/images/icons/offline_download.png", "Offline Download"),
    SmartAssistant: createIcon("/assets/images/icons/smart_assistant.png", "Smart Assistant"),
};

export default BrandIcons;
