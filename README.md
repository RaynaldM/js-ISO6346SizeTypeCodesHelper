# a Javascript Helper for ISO 6346 - Size and Type Codes
[From Wikipedia](https://en.wikipedia.org/wiki/ISO_6346):

ISO 6346 is an international standard covering the coding, identification and marking of intermodal (shipping) containers used within containerized intermodal freight transport. The standard establishes a visual identification system for every container that includes a unique serial number (with check digit), the owner, a country code, **a size, type and equipment category** as well as any operational marks. The standard is managed by the International Container Bureau (BIC).

I use Visual Studio 2015 Typescript project to made it.

## Dependency
* JQuery 2.xx
* Bootstrap 3.xx

## Example
click [here](http://rayspiration.fr/cnthelpers/index) for a demo

## How it works
* Add containerhelpers.js (or containerhelpers.min.js)
* Add an html sub directory and add _cnt-modal.html (or _cnt-modal.min.html) inside.
* Load containerhelpers.js
```html
    <script src="Scripts/containerhelpers.min.js"></script>
```
* Set an input group with "cnt-helpers-type" class like this :
```html
   <label>Your container type</label>
   <div class="input-group cnt-helpers-type">
        <input type="text" class="form-control" placeholder="Write the container type">
        <span class="input-group-btn">
            <button type="button" class="btn btn-default" aria-label="Left Align">
               <span class="glyphicon glyphicon-wrench" aria-hidden="true"></span>
           </button>
        </span>
    </div><!-- /input-group -->
    <p class="help-block">Undefined Container Type.</p> 
```
and when the page is Ready, call
```javascript
ContainerHelpers.InitTypeHelper();
```

That's all

### Todo :
Localization