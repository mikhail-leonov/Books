declare module 'twig' {
    interface TwigOptions {
        href?: string;
        path?: string;
        data?: string;
        async?: boolean;
        allowInlineIncludes?: boolean;
        namespaces?: Record<string, any>;
        rethrow?: boolean;
        cache?: boolean;
    }

    interface TwigModule {
        cache: (value: boolean) => void;
        renderFile: (
            path: string,
            data: Record<string, any>,
            cb: (err: Error | null, html: string) => void
        ) => void;
        __express: (path: string, options: any, fn: (err: any, html?: string) => void) => void;
    }

    const twig: TwigModule;
    export default twig;
}