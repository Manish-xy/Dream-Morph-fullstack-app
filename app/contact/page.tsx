import { Container } from "@/components/container";
import { CustomBreadCrump } from "@/components/custom-breadcrump";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "./_components/contact-form";

export default function ContactPage() {
  return (
    <Container className="space-y-8 py-8">
      <CustomBreadCrump breadCrumpPage="Contact" />
      
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Have questions about Dream Morph? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* Contact Info Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-lg border border-input bg-card hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20">
                <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">support@dreammorph.com</p>
                <p className="text-sm text-muted-foreground">hello@dreammorph.com</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-input bg-card hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20">
                <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                <p className="text-sm text-muted-foreground">Mon-Fri 9am-6pm EST</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg border border-input bg-card hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
                <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Office</h3>
                <p className="text-sm text-muted-foreground">123 AI Street</p>
                <p className="text-sm text-muted-foreground">San Francisco, CA 94102</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="p-8 rounded-lg border border-input bg-card shadow-sm">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </Container>
  );
}
