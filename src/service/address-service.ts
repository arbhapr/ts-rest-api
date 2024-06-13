import { Address, User } from "@prisma/client";
import {
    AddressResponse,
    CreateAddressRequest,
    DeleteAddressRequest,
    GetAddressRequest,
    UpdateAddressRequest,
    toAddressResponse,
} from "../model/address-model";
import { Validation } from "../validation/validation";
import { AddressValidation } from "../validation/address-validation";
import { ContactService } from "./contact-service";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { logger } from "../application/logging";

export class AddressService {
    static async create(
        user: User,
        request: CreateAddressRequest
    ): Promise<AddressResponse> {
        const createRequest = Validation.validate(
            AddressValidation.CREATE,
            request
        );

        await ContactService.checkContactMustExists(
            user.username,
            request.contact_id
        );

        const address = await prismaClient.address.create({
            data: createRequest,
        });

        return toAddressResponse(address);
    }

    static async get(
        user: User,
        request: GetAddressRequest
    ): Promise<AddressResponse> {
        const getRequest = Validation.validate(AddressValidation.GET, request);
        await ContactService.checkContactMustExists(
            user.username,
            getRequest.contact_id
        );
        const address = await this.checkAddressMustExists(
            getRequest.contact_id,
            getRequest.id
        );
        return toAddressResponse(address);
    }

    static async checkAddressMustExists(
        contactId: number,
        addressId: number
    ): Promise<Address> {
        const address = await prismaClient.address.findFirst({
            where: {
                id: addressId,
                contact_id: contactId,
            },
        });
        if (!address) {
            throw new ResponseError(404, "Address not found");
        }
        return address;
    }

    static async update(
        user: User,
        request: UpdateAddressRequest
    ): Promise<AddressResponse> {
        const updateRequest = Validation.validate(
            AddressValidation.UPDATE,
            request
        );
        await ContactService.checkContactMustExists(
            user.username,
            updateRequest.contact_id
        );
        let address = await this.checkAddressMustExists(
            updateRequest.contact_id,
            updateRequest.id
        );
        address = await prismaClient.address.update({
            where: {
                id: updateRequest.id,
            },
            data: updateRequest,
        });
        return toAddressResponse(address);
    }

    static async delete(
        user: User,
        request: DeleteAddressRequest
    ): Promise<AddressResponse> {
        const deleteRequest = await Validation.validate(
            AddressValidation.DELETE,
            request
        );
        await ContactService.checkContactMustExists(
            user.username,
            deleteRequest.contact_id
        );
        await this.checkAddressMustExists(
            deleteRequest.contact_id,
            deleteRequest.id
        );
        const address = await prismaClient.address.delete({
            where: {
                id: deleteRequest.id,
            },
        });
        return toAddressResponse(address);
    }

    static async list(
        user: User,
        contactId: number
    ): Promise<Array<AddressResponse>> {
        await ContactService.checkContactMustExists(user.username, contactId);

        const addresses = await prismaClient.address.findMany({
            where: {
                contact_id: contactId,
            },
        });

        return addresses.map((address) => toAddressResponse(address));
    }
}
