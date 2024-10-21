/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APIREQ_URL: string
    readonly NEXT_PUBLIC_API_URL: string
    readonly NEXT_PUBLIC_APIREQ_URL: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}