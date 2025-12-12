import {Component, computed, input, signal, Signal} from '@angular/core';
import {ChatList} from '../chat-list/chat-list';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-chats-main-window',
  imports: [
    ChatList,
    TranslatePipe
  ],
  templateUrl: './chats-main-window.html',
  styleUrl: './chats-main-window.css',
})
export class ChatsMainWindow {
  readonly view = input<undefined | "Seller" | "Buyer">(undefined);
  readonly productId = input<undefined | number>(undefined);
  readonly viewAs:Signal<"Seller" | "Buyer"> = computed(() => {
    if(this._view()) return this._view()!;
    return this.view() ?? "Seller"
  });

  private _view = signal<"Seller" | "Buyer" | undefined>(undefined);

  SwitchView() {
    this._view.set(
      this.viewAs() === "Seller" ? "Buyer" : "Seller"
    );
  }

  Select(view: "Seller" | "Buyer") {
    this._view.set(view);
  }
}
