import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
const timeFmt = new Intl.RelativeTimeFormat("en-US");
export default function Countdown(props) {
    const target = new Date(props.target);
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => {
            setNow((now) => {
                if (now > target) {
                    clearInterval(timer);
                }
                return new Date();
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [props.target]);
    if (now > target) {
        return h("span", null, "\uD83C\uDF89");
    }
    const secondsLeft = Math.floor((target.getTime() - now.getTime()) / 1000);
    return h("span", null, timeFmt.format(secondsLeft, "seconds"));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ291bnRkb3duLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiQ291bnRkb3duLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sUUFBUSxDQUFBO0FBQzFCLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sY0FBYyxDQUFBO0FBRWxELE1BQU0sT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBSXBELE1BQU0sQ0FBQyxPQUFPLFVBQVUsU0FBUyxDQUFDLEtBQXlCO0lBQ3pELE1BQU0sTUFBTSxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNyQyxNQUFNLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUE7SUFHMUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtRQUNiLE1BQU0sS0FBSyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUU7WUFDN0IsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7Z0JBQ2IsSUFBSSxHQUFHLEdBQUcsTUFBTSxFQUFFO29CQUNoQixhQUFhLENBQUMsS0FBSyxDQUFDLENBQUE7aUJBQ3JCO2dCQUNELE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQTtZQUNuQixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUNSLE9BQU8sR0FBRyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ25DLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0lBR2xCLElBQUksR0FBRyxHQUFHLE1BQU0sRUFBRTtRQUNoQixPQUFPLCtCQUFlLENBQUE7S0FDdkI7SUFHRCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBO0lBQ3pFLE9BQU8sZ0JBQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQVEsQ0FBQTtBQUM5RCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqIEBqc3ggaCAqL1xyXG5pbXBvcnQgeyBoIH0gZnJvbSBcInByZWFjdFwiXHJcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tIFwicHJlYWN0L2hvb2tzXCJcclxuXHJcbmNvbnN0IHRpbWVGbXQgPSBuZXcgSW50bC5SZWxhdGl2ZVRpbWVGb3JtYXQoXCJlbi1VU1wiKVxyXG5cclxuLy8gVGhlIHRhcmdldCBkYXRlIGlzIHBhc3NlZCBhcyBhIHN0cmluZyBpbnN0ZWFkIG9mIGFzIGEgYERhdGVgLCBiZWNhdXNlIHRoZVxyXG4vLyBwcm9wcyB0byBpc2xhbmQgY29tcG9uZW50cyBuZWVkIHRvIGJlIEpTT04gKGRlKXNlcmlhbGl6YWJsZS5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ291bnRkb3duKHByb3BzOiB7IHRhcmdldDogc3RyaW5nIH0pIHtcclxuICBjb25zdCB0YXJnZXQgPSBuZXcgRGF0ZShwcm9wcy50YXJnZXQpXHJcbiAgY29uc3QgW25vdywgc2V0Tm93XSA9IHVzZVN0YXRlKG5ldyBEYXRlKCkpXHJcblxyXG4gIC8v5Y+q6KaB57uE5Lu25bey5oyC6L2977yM5bCx6K6+572u5LiA5Liq6Ze06ZqU77yM5q+P56eS55So5b2T5YmN5pel5pyf5pu05pawIGBub3dgIOaXpeacn1xyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCB0aW1lciA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgc2V0Tm93KChub3cpID0+IHtcclxuICAgICAgICBpZiAobm93ID4gdGFyZ2V0KSB7XHJcbiAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IERhdGUoKVxyXG4gICAgICB9KVxyXG4gICAgfSwgMTAwMClcclxuICAgIHJldHVybiAoKSA9PiBjbGVhckludGVydmFsKHRpbWVyKVxyXG4gIH0sIFtwcm9wcy50YXJnZXRdKVxyXG5cclxuICAvLyDlpoLmnpznm67moIfml6XmnJ/lt7Lnu4/ov4fljrvvvIzlgZzmraLlgJLorqHml7ZcclxuICBpZiAobm93ID4gdGFyZ2V0KSB7XHJcbiAgICByZXR1cm4gPHNwYW4+8J+OiTwvc3Bhbj5cclxuICB9XHJcblxyXG4gIC8vIOWQpuWIme+8jOaIkeS7rOS9v+eUqCBgSW50bC5SZWxhdGl2ZVRpbWVGb3JtYXRgIOagvOW8j+WMluWJqeS9meaXtumXtOW5tua4suafk+Wug1xyXG4gIGNvbnN0IHNlY29uZHNMZWZ0ID0gTWF0aC5mbG9vcigodGFyZ2V0LmdldFRpbWUoKSAtIG5vdy5nZXRUaW1lKCkpIC8gMTAwMClcclxuICByZXR1cm4gPHNwYW4+e3RpbWVGbXQuZm9ybWF0KHNlY29uZHNMZWZ0LCBcInNlY29uZHNcIil9PC9zcGFuPlxyXG59XHJcbiJdfQ==