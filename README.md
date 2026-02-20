# Nginx-Fancyindex-Theme

> Nginx fancyindex theme built using modern toolchain

## Preview

(I'm too lazy to find a image for preview purpose, but the broken image icon also demonstrated it can show multimedia file, so... )

|Main|Info|
|---|---|
|![Screenshot of this fancyindex theme, featuring custom sorting, path breadcumb menu and search capability](/docs/assets/main.webp)|![Screenshot of this fancyindex theme when file info dialog is open, showing multimedia preview, size and date](/docs/assets/info.webp)|

## Build

```
deno run build
deno run split
```

## Deploy

Copy `dist/.fancyindex` to the `root` folder of your target nginx `server` block, then add the following configuration lines to the same `server` block:

```
fancyindex on;
fancyindex_header "/.fancyindex/header.html";
fancyindex_footer "/.fancyindex/footer.html";
```

To tweak other fancyindex options, refer to [upstream documentation](https://github.com/aperezdc/ngx-fancyindex#directives) for help.
