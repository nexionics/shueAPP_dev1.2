import Image from "next/image"
import Link from "next/link"
import styled from 'styled-components'
import { Card, CardContent } from "@/components/Card"
import { Product } from "@/lib/data"
import DefaultItemDetails from './ItemCardDetails'

interface ItemCardProps {
  product: Product
  children?: React.ReactNode
}

const DEFAULT_CARD_CLASSES = 'cursor-pointer overflow-hidden transition-all hover:shadow-lg max-w-[17.5rem]'
const DEFAULT_CARDCONTENT_CLASSES = 'p-4'
const DEFAULT_IMAGE_WRAPPER = ''

const StyledCard = styled(Card).attrs<{ className?: string }>(props => ({
  className: `${DEFAULT_CARD_CLASSES} ${props.className ?? ''}`
}))`
  height: 420px;
  display: flex;
  flex-direction: column;
  align-items: initial;
  justify-content: space-between;
`

const StyledCardContent = styled(CardContent).attrs<{ className?: string }>(props => ({
  className: `${DEFAULT_CARDCONTENT_CLASSES} ${props.className ?? ''}`
}))``

const ImageWrapper = styled.div.attrs<{ className?: string }>(props => ({
  className: `${DEFAULT_IMAGE_WRAPPER} ${props.className ?? ''}`
}))`
  width: 100%;
  max-width: 280px;
`

export function ItemCard({ product, children }: ItemCardProps) {
  return (
    <Link href={`/p/${product.id}`}>
      <StyledCard>
        <ImageWrapper>
          <Image
            src={product.images[0] || product.thumbnail || "/placeholder-shoe.svg"}
            alt={product.name}
            width={280}
            height={320}
          />
        </ImageWrapper>
        <StyledCardContent>
          {children ?? <DefaultItemDetails product={product} />}
        </StyledCardContent>
      </StyledCard>
    </Link>
  )
}
