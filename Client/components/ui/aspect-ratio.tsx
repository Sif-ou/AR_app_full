'use client'

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio'

function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }
//هو إطار تنسيقي يُستخدم لتثبيت أبعاد عنصر ما (مثل صورة أو فيديو) على نسبة عرض إلى ارتفاع محددة