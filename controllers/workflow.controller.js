import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express')

import dayjs from 'dayjs';

import Subscription from "../models/subscription.model.js";
import { sendReminderEmail } from '../utils/send-email.js';


// days to remind:
const REMINDERS = [7, 5, 2, 1];

export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;

    const subscription = await fetchSubscription(context, subscriptionId);

    
    if(!subscription || subscription.status !== "active") {
        return;
    } 
    const renewalDate = dayjs(subscription.renewalDate);

    // If renewal date is before "current date"
    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed subscription ${subscriptionId}. Stopping workflow`);
        return;
    }

    for (const daysBefore of REMINDERS) {
        // renewal date = 22 feb, reminder dates = 15 feb, 17, 20, 21
        const reminderDate = renewalDate.subtract(daysBefore, 'day');

        // if renewal date is after current date:
        // input: context, label(texte), date
        if (reminderDate.isAfter(dayjs())){
            await sleepUntilReminder(
                context,
                `${daysBefore} days before reminder `,
                reminderDate
            )
        }

        if (dayjs().isSame(reminderDate, 'day')) {
            // trigger reminder:
            // i.e 2 days before reminder
            await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
          }
    }
});



// -------- helper functions ------------------------

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate(
            'user',
            'name email' 
        );
    })
};

const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} reminder at ${date}`);

    await context.sleepUntil(label, date.toDate())
};

const triggerReminder = async (context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label} reminder`);

        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription

        });



    })
};