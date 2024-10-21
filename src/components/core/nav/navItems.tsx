import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { useRouter } from 'next/router';
import StyledNavButton from "../../common/buttons/navButton";

interface NavProps {
    item: {
        title: string;
        children: {
            title: string;
            icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
                muiName: string;
            };
            href: string;
            disabled: boolean;
        }[];
    },
    index: number
}

const NavItems = ({ item, index }: NavProps) => {
    const router = useRouter();

    return (
        <>
            {
                item.children.map((child, childIndex) => {
                    let isActive = router.pathname.includes(child.href);
                    return (
                        <StyledNavButton
                            key={childIndex}
                            child={child}
                            isActive={isActive}
                            index={index}
                            childIndex={childIndex}
                        />
                    )
                })
            }
        </>
    )
}

export default NavItems;