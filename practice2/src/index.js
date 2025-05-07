import { format } from 'date-fns';

const formatted = format(new Date(), 'yyyy/MM/dd (EEE)');
console.log(formatted);
