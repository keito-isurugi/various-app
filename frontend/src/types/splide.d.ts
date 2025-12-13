declare module "@splidejs/react-splide" {
	import type { ComponentType, ReactNode } from "react";

	interface SplideOptions {
		type?: "slide" | "loop" | "fade";
		rewind?: boolean;
		speed?: number;
		rewindSpeed?: number;
		width?: string | number;
		height?: string | number;
		fixedWidth?: string | number;
		fixedHeight?: string | number;
		heightRatio?: number;
		autoWidth?: boolean;
		autoHeight?: boolean;
		perPage?: number;
		perMove?: number;
		clones?: number;
		start?: number;
		focus?: number | "center";
		gap?: string | number;
		padding?:
			| string
			| number
			| { left?: string | number; right?: string | number };
		arrows?: boolean;
		arrowPath?: string;
		pagination?: boolean;
		paginationKeyboard?: boolean;
		easing?: string;
		easingFunc?: (t: number) => number;
		drag?: boolean | "free";
		snap?: boolean;
		noDrag?: string;
		dragMinThreshold?: number | { mouse: number; touch: number };
		flickPower?: number;
		flickMaxPages?: number;
		waitForTransition?: boolean;
		arrowPath?: string;
		autoplay?: boolean | "pause";
		interval?: number;
		pauseOnHover?: boolean;
		pauseOnFocus?: boolean;
		resetProgress?: boolean;
		lazyLoad?: boolean | "nearby" | "sequential";
		preloadPages?: number;
		keyboard?: boolean | "global" | "focused";
		wheel?: boolean;
		wheelMinThreshold?: number;
		wheelSleep?: number;
		releaseWheel?: boolean;
		direction?: "ltr" | "rtl" | "ttb";
		cover?: boolean;
		slideFocus?: boolean;
		isNavigation?: boolean;
		trimSpace?: boolean | "move";
		omitEnd?: boolean;
		focusableNodes?: string;
		updateOnMove?: boolean;
		mediaQuery?: "min" | "max";
		live?: boolean;
		breakpoints?: Record<number, Partial<SplideOptions>>;
		classes?: Record<string, string>;
		i18n?: Record<string, string>;
	}

	interface SplideProps {
		options?: SplideOptions;
		extensions?: Record<string, unknown>;
		transition?: unknown;
		hasTrack?: boolean;
		tag?: string;
		className?: string;
		children?: ReactNode;
		onMounted?: (splide: unknown) => void;
		onReady?: (splide: unknown) => void;
		onClick?: (splide: unknown, slide: unknown, e: Event) => void;
		onMove?: (splide: unknown, newIndex: number, prevIndex: number) => void;
		onMoved?: (splide: unknown, newIndex: number, prevIndex: number) => void;
		onActive?: (splide: unknown, slide: unknown) => void;
		onInactive?: (splide: unknown, slide: unknown) => void;
		onVisible?: (splide: unknown, slide: unknown) => void;
		onHidden?: (splide: unknown, slide: unknown) => void;
		onRefresh?: (splide: unknown) => void;
		onUpdated?: (splide: unknown, options: SplideOptions) => void;
		onResize?: (splide: unknown) => void;
		onResized?: (splide: unknown) => void;
		onDrag?: (splide: unknown) => void;
		onDragging?: (splide: unknown) => void;
		onDragged?: (splide: unknown) => void;
		onScroll?: (splide: unknown) => void;
		onScrolled?: (splide: unknown) => void;
		onDestroy?: (splide: unknown) => void;
		onArrowsMounted?: (
			splide: unknown,
			prev: HTMLButtonElement,
			next: HTMLButtonElement,
		) => void;
		onArrowsUpdated?: (
			splide: unknown,
			prev: HTMLButtonElement,
			next: HTMLButtonElement,
		) => void;
		onPaginationMounted?: (
			splide: unknown,
			data: unknown,
			item: unknown,
		) => void;
		onPaginationUpdated?: (
			splide: unknown,
			data: unknown,
			prev: unknown,
			curr: unknown,
		) => void;
		onNavigationMounted?: (splide: unknown, splides: unknown[]) => void;
		onAutoplayPlay?: (splide: unknown) => void;
		onAutoplayPause?: (splide: unknown) => void;
		onAutoplayPlaying?: (splide: unknown, rate: number) => void;
		onLazyLoadLoaded?: (
			splide: unknown,
			img: HTMLImageElement,
			slide: unknown,
		) => void;
	}

	interface SplideSlideProps {
		className?: string;
		children?: ReactNode;
	}

	export const Splide: ComponentType<SplideProps>;
	export const SplideSlide: ComponentType<SplideSlideProps>;
	export const SplideTrack: ComponentType<{ children?: ReactNode }>;
}

declare module "@splidejs/react-splide/css/sea-green" {}
