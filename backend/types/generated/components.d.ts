import type { Schema, Struct } from '@strapi/strapi';

export interface ItemQuantityOwnedItem extends Struct.ComponentSchema {
  collectionName: 'components_item_quantity_owned_items';
  info: {
    description: '';
    displayName: 'OwnedItem';
  };
  attributes: {
    item: Schema.Attribute.Relation<'oneToOne', 'api::item.item'>;
    note: Schema.Attribute.String;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<1>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'item-quantity.owned-item': ItemQuantityOwnedItem;
    }
  }
}
