/**
 * The hero's pill button pair, shared so the closing CTA is the same object
 * rather than a lookalike. Sizes are the reference button metrics.
 */
const buttonBase =
  'group inline-flex h-[64px] items-center rounded-full font-nav text-[23px] font-semibold leading-none tracking-[0.04em]'

export const primaryButton = `${buttonBase} gap-[24px] bg-gradient-to-r from-[#D9A6F0] to-[#B061D8] px-[32px] text-[#1B0F24] transition-shadow hover:shadow-[0_0_28px_rgba(192,143,224,0.45)]`

export const secondaryButton = `${buttonBase} gap-[30px] border border-white/55 px-[36px] text-white transition-colors hover:border-purple-light hover:text-purple-light`
