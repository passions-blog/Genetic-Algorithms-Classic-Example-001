# Genetic-Algorithms-Classic-Example-001
A JavaScript widget showing how classing Genetic Algorithm works.

[Here is the DEMO](https://passions-blog.github.io/Genetic-Algorithms-Classic-Example-001/) of that widget, feel free to use it anywhere.
You can add this widget to any page in an iframe. THe script supports auto resize of parent frame. The script sends a special message
to the parent page so you can handle it and automatically resize the IFRAME tag. Below an example, how to do it:

```html
<iframe
    id="ifrm"
    style="border: none; margin: 0; padding: 0; width: 100%; box-sizing: border-box"
    src="https://passions-blog.github.io/Genetic-Algorithms-Classic-Example-001/"></iframe>

<script type="text/javascript">
        window.addEventListener('message', receiveMessage, false);
        function receiveMessage(evt) {
            // Do we trust the sender of this message?
            if (evt.origin !== "https://passions-blog.github.io") {
                return;
            }
            if (evt.data.type === "frame-resized") {
                document.getElementById("ifrm").style.height = evt.data.value + "px";
            }
        }
</script>
```

The code is safe and simple.

Please visit my blog to find out more about Genetic Algorithms: https://portfolio.porombka.pl.