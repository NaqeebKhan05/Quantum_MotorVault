import { date, integer, json, pgTable, serial, varchar } from "drizzle-orm/pg-core";

// for default value adding use ".default('Your Value'),"

export const CarListing=pgTable('carListing',{
    id:serial('id').primaryKey(),
    listingTitle:varchar('listingTitle').notNull(),
    tagline:varchar('tagline'),
    sellingPrice:varchar('sellingPrice').notNull(),
    bookingPrice:varchar('bookingPrice'),
    category:varchar('category').notNull(),
    condition:varchar('condition').notNull(),
    make:varchar('make').notNull(),
    model:varchar('model').notNull(),
    year:varchar('year').notNull(),
    driveType:varchar('driveType').notNull(),
    transmission:varchar('transmission').notNull(),
    mileage:varchar('mileage').notNull(),
    fuelType:varchar('fuelType').notNull(),
    engineSize:varchar('engineSize'),
    cylinder:varchar('cylinder'),
    color:varchar('color').notNull(),
    door:varchar('door').notNull(),
    location:varchar('location').notNull(),
    offerType:varchar('offerType'),
    listingDescription:varchar('listingDescription').notNull(),
    features:json('features'),
    createdBy:varchar('createdBy').notNull(),
    userName:varchar('userName').notNull(),
    userImageUrl:varchar('userImageUrl'),
    postedOn:varchar('postedOn'),
    sold:varchar('sold'),
    toggleVisibility:varchar('toggleVisibility'),
})

export const CarImages=pgTable('carImages',{
    id:serial('id').primaryKey(),
    imageUrl:varchar('imageUrl').notNull(),
    carListingId:integer('carListingId').notNull().references(()=>CarListing.id),
})

export const CarBooking=pgTable('carBooking',{
    id: serial('id').primaryKey(),
    pickupDate: date('pickupDate').notNull(),
    returnDate: date('returnDate').notNull(),
    bookingAmount: varchar('bookingAmount'),
    bookedBy: varchar('bookedBy').notNull(),
    bookingStatus: varchar('bookingStatus').notNull().default('Pending'),
    carListingId: integer('carListingId').notNull().references(()=>CarListing.id),
})