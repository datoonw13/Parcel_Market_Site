import Chat from '@/components/comet-chat/CometChat'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense><Chat /></Suspense>
  )
}

export default page