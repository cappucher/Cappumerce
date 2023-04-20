import { Sequelize, Model, DataTypes } from "sequelize";
require('dotenv').config({ path: '.env.local' }); // Load environment variables from .env.local file

const sequelize = new Sequelize(process.env.DATABASE_NAME!, "cappucher", String(process.env.DATABASE_PASSWORD!), {
    host: process.env.DATABASE_HOST!,
    port: 5432,
    dialect: "postgres",
    dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // This is necessary if the database uses a self-signed certificate
        }
    }
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.log(process.env.DATABASE_PASSWORD!)
        console.error('Unable to connect to the database:', error);
      }
})();

class User extends Model {
    public id!: number;
    public username!: string;
    public password!: string;
}
class Listing extends Model { 
    public id!: number;
    public title!: string;
    public description!: string
    public bid!: number;
    public dateOfCreation!: string;
    public dateOfFinishing!: string;
    public creator!: string;
    public link!: string;
    public category!: string;
    public finished!: boolean;
    public winner!: string;
}
class Watchlist extends Model { 
    public userId!: number;
    public listingId!: number;
    public onWatchlist!: boolean;
}

class Like extends Model {
    public userId!: number;
    public commentId!: number;
    public liked!: boolean;
}

class Comment extends Model {
    public id!: number; 
    public userId!: number;
    public listingId!: number;
    public textContent!: string;
    public dateOfCreation!: string;
    public creator!: string;
    public likes!: number;
}



// // hello

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.BIGINT,
        },
    },
    {
        timestamps: false,
        sequelize,
        modelName: "User",
    }
);

Listing.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(5000),
            allowNull: false,
        },
        bid: {
            type: DataTypes.FLOAT(10),
            allowNull: false,
        },
        dateOfCreation: {
            type: DataTypes.STRING,
        },
        dateOfFinishing: {
            type: DataTypes.STRING,
        },
        creator: {
            type: DataTypes.STRING,
        },
        link: {
            type: DataTypes.STRING,
        },
        category: {
            type: DataTypes.STRING,
        },
        finished: {
            type: DataTypes.BOOLEAN,
        },
        winner: {
            type: DataTypes.STRING,
            defaultValue: "@nobody",
        },
    },
    {
        timestamps: false,
        sequelize,
        modelName: "Listing",
    }
);

Watchlist.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        listingId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        onWatchlist: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        sequelize,
        modelName: "Watchlist",
    }
);

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER
        },
        listingId: {
            type: DataTypes.INTEGER
        },
        textContent: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dateOfCreation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        creator: {
            type: DataTypes.STRING,
            allowNull: false
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "Comment"
    }
)

Like.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        commentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        liked: {
            type: DataTypes.BOOLEAN
        },
    },
    {
        sequelize,
        modelName: "Like"
    }
)



export { User, Listing, Watchlist, Comment, Like }