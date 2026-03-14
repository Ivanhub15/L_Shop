export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');
}

export function clearContainer(element: HTMLElement): void {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Record<string, string | boolean | ((e: Event) => void)>,
  ...children: (string | HTMLElement)[]
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('on')) {
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, value as (e: Event) => void);
      } else if (typeof value === 'boolean') {
        if (value) {
          element.setAttribute(key, '');
        }
      } else {
        element.setAttribute(key, String(value));
      }
    });
  }

  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
}
