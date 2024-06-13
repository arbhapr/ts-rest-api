import supertest from "supertest";
import { AddressTest, ContactTest, UserTest } from "./test-util";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

describe("POST /api/contacts/:contactId/addressess", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });
    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able create address", async () => {
        const contact = await ContactTest.get();
        logger.debug("contact: " + JSON.stringify(contact));
        const response = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "Jalan belum ada",
                city: "Jakarta",
                province: "DKI Jakarta",
                country: "Indonesia",
                postal_code: "14045",
            });
        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.street).toBe("Jalan belum ada");
        expect(response.body.data.city).toBe("Jakarta");
        expect(response.body.data.province).toBe("DKI Jakarta");
        expect(response.body.data.country).toBe("Indonesia");
        expect(response.body.data.postal_code).toBe("14045");
    });

    it("should reject create address if request is invalid", async () => {
        const contact = await ContactTest.get();
        logger.debug("contact: " + JSON.stringify(contact));
        const response = await supertest(web)
            .post(`/api/contacts/${contact.id}/addresses`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "Jalan belum ada",
                city: "Jakarta",
                province: "DKI Jakarta",
                country: "",
                postal_code: "",
            });
        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject create address if contact is not found", async () => {
        const contact = await ContactTest.get();
        logger.debug("contact: " + JSON.stringify(contact));
        const response = await supertest(web)
            .post(`/api/contacts/${contact.id + 1}/addresses`)
            .set("X-API-TOKEN", "test")
            .send({
                street: "Jalan belum ada",
                city: "Jakarta",
                province: "DKI Jakarta",
                country: "Indonesia",
                postal_code: "14045",
            });
        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe("GET /api/contacts/:contactId/addressess/:addressId", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });
    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to get address", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");
        // logger.debug(response.body);
        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.street).toBe(address.street);
        expect(response.body.data.city).toBe(address.city);
        expect(response.body.data.province).toBe(address.province);
        expect(response.body.data.country).toBe(address.country);
        expect(response.body.data.postal_code).toBe(address.postal_code);
    });

    it("should reject to get address if contact is not found", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();
        logger.debug("contact: " + JSON.stringify(contact));
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");
        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe("PUT /api/contacts/:contactId/addressess", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });
    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to update address", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();
        logger.debug("contact: " + JSON.stringify(contact));
        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                country: "Ubah",
                postal_code: "18085",
            });
        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(address.id);
        expect(response.body.data.street).toBe(address.street);
        expect(response.body.data.city).toBe(address.city);
        expect(response.body.data.province).toBe(address.province);
        expect(response.body.data.country).toBe("Ubah");
        expect(response.body.data.postal_code).toBe("18085");
    });

    it("should reject to update address if validation invalid", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();
        logger.debug("contact: " + JSON.stringify(contact));
        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                city: "Kota Ubah",
                country: "",
                postal_code: "",
            });
        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject to update address if address not found", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();
        logger.debug("contact: " + JSON.stringify(contact));
        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set("X-API-TOKEN", "test")
            .send({
                country: "Ubah",
                postal_code: "18085",
            });
        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe("DELETE /api/contacts/:contactId/addressess/:addressId", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });
    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to delete address", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();
        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");
        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");
    });

    it("should reject to delete address if address not found", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();
        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id}/addresses/${address.id + 1}`)
            .set("X-API-TOKEN", "test");
        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });

    it("should reject to delete address if contact not found", async () => {
        const contact = await ContactTest.get();
        const address = await AddressTest.get();
        logger.debug("contact: " + JSON.stringify(contact));
        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id + 1}/addresses/${address.id}`)
            .set("X-API-TOKEN", "test");
        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});


describe("GET /api/contacts/:contactId/addressess", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
        await AddressTest.create();
    });
    afterEach(async () => {
        await AddressTest.deleteAll();
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it("should be able to list addresses", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}/addresses`)
            .set("X-API-TOKEN", "test");
        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
    });

    it("should reject list addresses if contact is not found", async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 1}/addresses`)
            .set("X-API-TOKEN", "test");
        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});