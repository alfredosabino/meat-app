import * as restify from 'restify'
import * as mongoose from 'mongoose'
import {environment} from '../common/environment'
import { Router } from '../common/router'

export class Server {

    application: restify.Server

    initializeDb(): mongoose.MongooseThenable {
        (<any>mongoose).Promise = global.Promise
        return mongoose.connect(environment.db.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    }

    initRoutes(routers: Router[]): Promise<any>{
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })

                this.application.use(restify.plugins.queryParser())

                // routes
                for (let router of routers) {
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server, () => {
                    resolve(this.application)
                })

            } catch(error){
                reject(error)
            }
        })
    }

    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() =>
            this.initRoutes(routers).then(() => this)
    }

}