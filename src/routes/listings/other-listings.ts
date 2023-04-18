import { Listing, User, Watchlist } from "../../models";
import { authenticated } from "../auth/login";
import { Router, Request, Response } from "express";
import { Op } from "sequelize"


interface categoryObject {
    books: string,
    business: string,
    clothing: string,
    collectibles: string,
    electronics: string,
    crafts: string,
    dolls: string,
    home: string,
    motors: string,
    pets: string,
    sports: string,
    shop: string,
    toys: string,
    antiques: string,
    computers: string,
    none: string

}
const categoryObject: categoryObject = {
    "books": "Books",
    "business": "Business & Industrial",
    "clothing": "Clothing, Shoes, & Accesories",
    "collectibles": "Collectibles",
    "electronics": "Consumer Electronics",
    "crafts": "Crafts",
    "dolls": "Dolls & Bears",
    "home": "Home & Garden",
    "motors": "Motors",
    "pets": "Pet Supplies",
    "sports": "Sporting Goods",
    "shop": "Sports Mem, Cards, & Fan Shop",
    "toys": "Toys & Hobbies",
    "antiques": "Antiques",
    "computers": "Computers/Tablets & Networking",
    "none": "None",
}

const findDate = (): string => {
    let today: Date = new Date();
    const dd: string = String(today.getDate()).padStart(2, '0');
    const mm: string = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy: string = today.getFullYear().toString();
    const date: string = mm + '/' + dd + '/' + yyyy;
    return date;
}

const otherListings: Router = Router();


otherListings.get("/category_listings", async (_: Request, res: Response): Promise<void> => {
    if (!authenticated.auth) {
        res.redirect("/login");
    }
    else {
        const listings = await Listing.findAll({
            where: {
                finished: false,
                category: "None"
            }
        })
        res.render("listings/category_listings", { listings: listings, username: authenticated.name, object: categoryObject, value: "" });
    }
})

otherListings.get("/category_listings/:category", async (req: Request, res: Response): Promise<void> => {
    if (!authenticated.auth) {
        res.redirect("/login");
    }
    else if (categoryObject[req.params.category as keyof categoryObject] == undefined){
        res.render("404", {authenticated: authenticated.auth, username: authenticated.name});
    }
    else {
        const listings: Array<Listing> = await Listing.findAll({
            where: {
                finished: false,
                category: categoryObject[req.params.category as keyof categoryObject]
            }
        })
        if (listings.length == 0) {
            res.render("listings/category_listings", { listings: [], username: authenticated.name, object: categoryObject, value: categoryObject[req.params.category as keyof categoryObject] })
        }
        else {
            console.log(categoryObject[req.params.category as keyof categoryObject]);
            res.render("listings/category_listings", { listings: listings, username: authenticated.name, object: categoryObject, value: categoryObject[req.params.category as keyof categoryObject] })
        }
    }
})

otherListings.get("/watchlist", async (_: Request, res: Response): Promise<void> => {

    if (!authenticated.auth) {
        res.redirect("/login");
    }
    else {
        const users: Array<User> = await User.findAll({
            where: {
                username: authenticated.name.toLowerCase()
            }
        })
        const watchlist: Array<Watchlist> = await Watchlist.findAll({
            where: {
                userId: users[0].id,
                onWatchlist: true
            }
        })
        const entries: number[] = [];
        for (let i = 0; i < watchlist.length; i++) {
            entries.push(watchlist[i].listingId);
        }
        if (entries.length == 0) {
            res.render("listings/watchlist", { listings: [], username: authenticated.name });
        } else {
            const listings = await Listing.findAll({
                where: {
                    id: {
                        [Op.or]: entries
                    }
                }
            })
            res.render("listings/watchlist", { listings: listings, username: authenticated.name })
        }
    }
})

otherListings.post("/endListing/:listing", async (req: Request, res: Response): Promise<void> => {
    await Listing.update({finished: true, dateOfFinishing: findDate()}, {
        where: {
            id: parseInt(req.params.listing)
        }
    })
    res.redirect(`/listing/${req.params.listing}`)
})



export default otherListings
