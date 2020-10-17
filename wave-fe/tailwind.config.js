const {
  colors: { pink, yellow, ...colors },
} = require("tailwindcss/defaultTheme");

module.exports = {
  corePlugins: [
    "preflight", //	Tailwind's base/reset styles
    // 'container', // The container component
    // 'accessibility', // The sr-only and not-sr-only utilities
    // 'alignContent', // The align-content utilities like content-between
    // 'alignItems', // The align-items utilities like items-start
    // 'alignSelf', // The align-self utilities like self-end
    // 'appearance', // The appearance utilities like appearance-none
    // 'backgroundAttachment', // The background-attachment utilities like bg-fixed
    "backgroundColor", // The background-color utilities like bg-gray-200
    // 'backgroundOpacity', // The background-color opacity utilities like bg-opacity-25
    // 'backgroundPosition', // The background-position utilities like bg-center
    // 'backgroundRepeat', // The background-repeat utilities like bg-no-repeat
    // 'backgroundSize', // The background-size utilities like bg-cover
    // 'borderCollapse', // The border-collapse utilities like border-separate
    "borderColor", // The border-color utilities like border-gray-300
    // 'borderOpacity', // The border-color opacity utilities like border-opacity-25
    "borderRadius", // The border-radius utilities like rounded-lg
    // 'borderStyle', // The border-style utilities like border-dashed
    "borderWidth", // The border-width utilities like border-2
    // 'boxSizing', // The box-sizing utilities like box-border
    // 'boxShadow', // The box-shadow utilities like shadow-xl
    // 'clear', // The clear utilities like clear-left
    // 'cursor', // The cursor utilities like cursor-pointer
    "display", // The display utilities like block
    // 'divideColor', // The between elements border-color utilities like divide-gray-500
    // 'divideWidth', // The between elements border-width utilities like divide-x-2
    // 'fill', // The fill utilities like fill-current
    "flex", // The flex utilities like flex-1
    // 'flexDirection', // The flex-direction utilities like flex-col
    // 'flexGrow', // The flex-grow utilities like flex-grow-0
    // 'flexShrink', // The flex-shrink utilities like flex-shrink-0
    // 'flexWrap', // The flex-wrap utilities like flex-no-wrap
    // 'float', // The float utilities like float-left
    // 'gap', // The gap utilities like gap-4
    // 'gridAutoFlow', // The grid-auto-flow utilities like grid-flow-col
    // 'gridColumn', // The grid-column utilities like col-span-6
    // 'gridColumnStart', // The grid-column-start utilities like col-start-1
    // 'gridColumnEnd', // The grid-column-end utilities like col-end-4
    // 'gridRow', // The grid-row utilities like row-span-6
    // 'gridRowStart', // The grid-row-start utilities like row-start-1
    // 'gridRowEnd', // The grid-row-end utilities like row-end-4
    // 'gridTemplateColumns', // The grid-template-columns utilities like grid-cols-4
    // 'gridTemplateRows', // The grid-template-rows utilities like grid-rows-4
    // 'fontFamily', // The font-family utilities like font-sans
    // 'fontSize', // The font-size utilities like text-xl
    // 'fontSmoothing', // The font-smoothing utilities like antialiased
    // 'fontStyle', // The font-style utilities like italic
    // 'fontWeight', // The font-weight utilities like font-bold
    // 'height', // The height utilities like h-8
    // 'inset', // The inset utilities like top-0
    // 'justifyContent', // The justify-content utilities like justify-between
    // 'letterSpacing', // The letter-spacing utilities like tracking-tight
    // 'lineHeight', // The line-height utilities like leading-normal
    // 'listStylePosition', // The list-style-position utilities like list-inside
    // 'listStyleType', // The list-style-type utilities like list-disc
    "margin", // The margin utilities like mt-4
    // 'maxHeight', // The max-height utilities like max-h-screen
    // 'maxWidth', // The max-width utilities like max-w-full
    // 'minHeight', // The min-height utilities like min-h-screen
    // 'minWidth', // The min-width utilities like min-w-0
    // 'objectFit', // The object-fit utilities like object-cover
    // 'objectPosition', // The object-position utilities like object-center
    // 'opacity', // The opacity utilities like opacity-50
    // 'order', // The flexbox order utilities like order-last
    // 'outline', // The outline utilities like outline-none
    // 'overflow', // The overflow utilities like overflow-hidden
    "padding", // The padding utilities like py-12
    // 'placeholderColor', // The placeholder color utilities like placeholder-red-600
    // 'placeholderOpacity', // The placeholder color opacity utilities like placeholder-opacity-25
    // 'pointerEvents', // The pointer-events utilities like pointer-events-none
    // 'position', // The position utilities like absolute
    // 'resize', // The resize utilities like resize-y
    // 'rotate', // The rotate utilities like rotate-90
    // 'scale', // The scale utilities like scale-150
    // 'skew', // The skew utilities like skew-y-3
    // 'space', // The 'space-between' utilities like space-x-4
    // 'stroke', // The stroke utilities like stroke-current
    // 'strokeWidth', // The stroke-width utilities like stroke-2
    // 'tableLayout', // The table-layout utilities like table-fixed
    // 'textAlign', // The text-align utilities like text-center
    "textColor", // The text-color utilities like text-red-600
    // 'textOpacity', // The text-color opacity utilities like text-opacity-25
    // 'textDecoration', // The text-decoration utilities like underline
    // 'textTransform', // The text-transform utilities like uppercase
    // 'transform', // The transform utility (for enabling transform features)
    // 'transitionDuration', // The transition-duration utilities like duration-100
    // 'transitionProperty', // The transition-property utilities like transition-colors
    // 'transitionTimingFunction', // The transition-timing-function utilities like ease-in-out
    // 'translate', // The translate utilities like translate-y-6
    "userSelect", // The user-select utilities like user-select-none
    // 'verticalAlign', // The vertical-align utilities like align-middle
    // 'visibility', // The visibility utilities like invisible
    // 'whitespace', // The whitespace utilities like whitespace-no-wrap
    // 'width', // The width utilities like w-1/2
    // 'wordBreak', // The word-break utilities like break-all
    // 'zIndex', // The z-index utilities like z-50
  ],
  purge: ["./src/**/*.html", "./src/**/*.ts"],
  theme: {
    colors,
    screens: {
      // sm: '640px',
      // md: '768px',
      // lg: '1024px',
      // xl: '1280px',
    },
    spacing: {
      // https://tailwindcss.com/docs/customizing-spacing#default-spacing-scale
      0: "0",
      px: "1px",
      1: "0.25rem",
      2: "0.5rem",
      3: "0.75rem",
      4: "1rem",
      5: "1.25rem",
      6: "1.5rem",
      8: "2rem",
      10: "2.5rem",
      12: "3rem",
      16: "4rem",
      20: "5rem",
      24: "6rem",
    },
    extend: {},
  },
  variants: {
    // https://tailwindcss.com/docs/configuring-variants/#default-variants-reference
    //  'responsive', 'group-hover', 'group-focus', 'focus-within', 'first', 'last', 'odd', 'even',
    //  'hover', 'focus', 'active', 'visited', 'disabled'
    backgroundColor: ["hover"],
    borderColor: [],
    textColor: [],
  },
  plugins: [],
};
