"use client";
"use client";
import React, { useState } from "react";
import { Button } from "@/components/button";
import { Check, X } from "lucide-react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorParagraph } from "@/components/error-paragraph";
import { Contact, contactSchema } from "@/lib/data/schemas/contact";
import {
  createContact,
  updateContact,
} from "@/lib/data/controllers/contacts.controller";
import { usePathname, useRouter } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { useContact } from "@/lib/data/hooks/contacts";

const Page = () => {
  const pathnameArr = usePathname().split("/");
  const id = pathnameArr[pathnameArr.length - 1];
  const { contact, isLoading, isError } = useContact(id);
  const methods = useForm<Contact>({
    resolver: zodResolver(contactSchema),
  });
  const { handleSubmit } = methods;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit: SubmitHandler<Contact> = async (_data) => {
    setLoading(true);
    const res = await updateContact({ id, data: _data });
    if (res.success) {
      router.push("/");
    } else {
      setError(res.message);
    }
    setLoading(false);
  };
  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data))}>
      <FormProvider {...methods}>
        <ContactForm contact={contact}>
          <div className="flex self-end">
            <ErrorParagraph>{error}</ErrorParagraph>
            <Button variant="ghost" size="lg" type="submit" disabled={loading}>
              <Check className="w-8 h-8" />
            </Button>
            <Button variant="ghost" size="lg" type="button">
              <a href="/">
                <X className="w-8 h-8" />
              </a>
            </Button>
          </div>
        </ContactForm>
      </FormProvider>
    </form>
  );
};

export default Page;
