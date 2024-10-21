import { MusicVideoOutlined, VideoLibraryOutlined } from '@mui/icons-material';
import AlbumOutlinedIcon from '@mui/icons-material/AlbumOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DomainOutlinedIcon from '@mui/icons-material/DomainOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import InterestsOutlinedIcon from '@mui/icons-material/InterestsOutlined';
import PlaylistPlayOutlinedIcon from '@mui/icons-material/PlaylistPlayOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';

export const Navigation = [
    {
        title: "content",
        children: [
            {
                title: "musicVideos",
                icon: MusicVideoOutlined,
                href: "/content/videos/music",
                disabled: true,
            },
            {
                title: "externalVideos",
                icon: VideoLibraryOutlined,
                href: "/content/videos/external",
                disabled: true,
            },
            {
                title: "artists",
                icon: AlbumOutlinedIcon,
                href: "/content/artists",
                disabled: true,
            }
        ]
    },
    {
        title: "projectPlayer",
        children: [
            {
                title: "layout",
                icon: DashboardOutlinedIcon,
                href: "/project-player/layout",
                disabled: false,
            },
            {
                title: "playlists",
                icon: PlaylistPlayOutlinedIcon,
                href: "/project-player/playlists",
                disabled: true,
            },
            {
                title: "mixes",
                icon: InterestsOutlinedIcon,
                href: "/project-player/mixes",
                disabled: true,
            },
            {
                title: "schedules",
                icon: ScheduleOutlinedIcon,
                href: "/project-player/schedules",
                disabled: true,
            }
        ]
    },
    {
        title: "clients",
        children: [
            {
                title: "businesses",
                icon: DomainOutlinedIcon,
                href: "/clients/businesses",
                disabled: true,
            },
            {
                title: "managed",
                icon: HandshakeOutlinedIcon,
                href: "/clients/managed",
                disabled: true,
            }
        ]
    },
]
