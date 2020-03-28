
import ctrlHome from "./home/ctrl.home";
import ctrlUser from './users/ctrl.user';


const controllers: any[] = [
    ctrlHome.router,
    ctrlUser.router
];

export default controllers;
